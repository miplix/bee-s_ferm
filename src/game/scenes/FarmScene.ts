import Phaser from "phaser";
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, PLAYER_SPEED, RESOURCE_YIELD } from "../config";
import type { PlacedObject, PlayerPresence } from "@/types";

interface FarmSceneData {
  accountId: string;
  playerX: number;
  playerY: number;
  placedObjects: PlacedObject[];
  resources: Record<string, number>;
  onResourceChange: (resources: Record<string, number>) => void;
  onPositionChange: (x: number, y: number) => void;
}

export class FarmScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private placedSprites: Map<string, Phaser.GameObjects.Sprite> = new Map();
  private otherPlayers: Map<string, Phaser.GameObjects.Sprite> = new Map();
  private resources: Record<string, number> = {};
  private accountId = "";
  private onResourceChange?: (r: Record<string, number>) => void;
  private onPositionChange?: (x: number, y: number) => void;
  private positionTimer = 0;
  private nameLabels: Map<string, Phaser.GameObjects.Text> = new Map();

  constructor() {
    super({ key: "FarmScene" });
  }

  init(data: FarmSceneData) {
    this.accountId = data.accountId;
    this.resources = { ...data.resources };
    this.onResourceChange = data.onResourceChange;
    this.onPositionChange = data.onPositionChange;
  }

  create() {
    // Draw grid
    for (let x = 0; x < MAP_WIDTH; x++) {
      for (let y = 0; y < MAP_HEIGHT; y++) {
        this.add.image(x * TILE_SIZE + 32, y * TILE_SIZE + 32, "grass");
      }
    }

    // Camera bounds
    this.cameras.main.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);

    // Player
    const initData = this.scene.settings.data as FarmSceneData;
    this.player = this.add.sprite(initData.playerX || 400, initData.playerY || 300, "player");
    this.player.setDepth(10);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      w: this.input.keyboard!.addKey("W"),
      a: this.input.keyboard!.addKey("A"),
      s: this.input.keyboard!.addKey("S"),
      d: this.input.keyboard!.addKey("D"),
    };

    // Render placed objects
    for (const obj of initData.placedObjects) {
      this.addPlacedSprite(obj);
    }

    // Click to harvest
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.handleClick(pointer);
    });
  }

  update(_time: number, delta: number) {
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.a.isDown) vx = -1;
    else if (this.cursors.right.isDown || this.wasd.d.isDown) vx = 1;
    if (this.cursors.up.isDown || this.wasd.w.isDown) vy = -1;
    else if (this.cursors.down.isDown || this.wasd.s.isDown) vy = 1;

    // Normalize diagonal
    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    this.player.x += vx * PLAYER_SPEED * (delta / 1000);
    this.player.y += vy * PLAYER_SPEED * (delta / 1000);

    // Clamp to map
    this.player.x = Phaser.Math.Clamp(this.player.x, 16, MAP_WIDTH * TILE_SIZE - 16);
    this.player.y = Phaser.Math.Clamp(this.player.y, 16, MAP_HEIGHT * TILE_SIZE - 16);

    // Broadcast position every 200ms
    this.positionTimer += delta;
    if (this.positionTimer > 200 && (vx !== 0 || vy !== 0)) {
      this.positionTimer = 0;
      this.onPositionChange?.(this.player.x, this.player.y);
    }

    // Update other player label positions
    for (const [id, sprite] of this.otherPlayers) {
      const label = this.nameLabels.get(id);
      if (label) {
        label.setPosition(sprite.x, sprite.y - 24);
      }
    }
  }

  private handleClick(pointer: Phaser.Input.Pointer) {
    const worldX = pointer.worldX;
    const worldY = pointer.worldY;

    // If in placement mode, place the object
    if (this.placementCallback) {
      const gridX = Math.floor(worldX / TILE_SIZE);
      const gridY = Math.floor(worldY / TILE_SIZE);
      this.placementCallback(gridX, gridY);
      this.exitPlacementMode();
      return;
    }

    // Check if clicking on a placed object to harvest
    for (const [id, sprite] of this.placedSprites) {
      const dist = Phaser.Math.Distance.Between(worldX, worldY, sprite.x, sprite.y);
      if (dist < TILE_SIZE / 2) {
        this.harvestObject(id, sprite);
        return;
      }
    }
  }

  private harvestObject(id: string, sprite: Phaser.GameObjects.Sprite) {
    const objType = sprite.getData("objectType") as string;
    const lastHarvest = sprite.getData("lastHarvest") as number || 0;
    const now = Date.now();
    const config = RESOURCE_YIELD[objType];
    if (!config) return;

    if (now - lastHarvest < config.cooldown) {
      // Show cooldown feedback
      this.showFloatingText(sprite.x, sprite.y - 20, "⏳", 0xffaa00);
      return;
    }

    sprite.setData("lastHarvest", now);
    this.resources[config.resource] = (this.resources[config.resource] || 0) + config.amount;
    this.onResourceChange?.({ ...this.resources });

    // Visual feedback
    this.showFloatingText(sprite.x, sprite.y - 20, `+${config.amount} ${config.resource}`, 0x00ff00);
    this.tweens.add({
      targets: sprite,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 100,
      yoyo: true,
    });
  }

  private showFloatingText(x: number, y: number, text: string, color: number) {
    const t = this.add.text(x, y, text, {
      fontSize: "14px",
      color: `#${color.toString(16).padStart(6, "0")}`,
    }).setOrigin(0.5).setDepth(100);

    this.tweens.add({
      targets: t,
      y: y - 30,
      alpha: 0,
      duration: 800,
      onComplete: () => t.destroy(),
    });
  }

  // === Public API called from React ===

  addPlacedSprite(obj: PlacedObject) {
    const x = obj.grid_x * TILE_SIZE + TILE_SIZE / 2;
    const y = obj.grid_y * TILE_SIZE + TILE_SIZE / 2;
    const sprite = this.add.sprite(x, y, obj.object_type);
    sprite.setData("objectType", obj.object_type);
    sprite.setData("objectId", obj.id);
    sprite.setInteractive();
    this.placedSprites.set(obj.id, sprite);
  }

  removePlacedSprite(id: string) {
    const sprite = this.placedSprites.get(id);
    if (sprite) {
      sprite.destroy();
      this.placedSprites.delete(id);
    }
  }

  updateOtherPlayer(presence: PlayerPresence) {
    let sprite = this.otherPlayers.get(presence.account_id);
    if (!sprite) {
      sprite = this.add.sprite(presence.x, presence.y, "other_player");
      sprite.setDepth(9);
      this.otherPlayers.set(presence.account_id, sprite);

      const label = this.add.text(presence.x, presence.y - 24, presence.display_name, {
        fontSize: "11px",
        color: "#ffffff",
        backgroundColor: "#00000088",
        padding: { x: 4, y: 2 },
      }).setOrigin(0.5).setDepth(11);
      this.nameLabels.set(presence.account_id, label);
    }

    // Smooth lerp to new position
    this.tweens.add({
      targets: sprite,
      x: presence.x,
      y: presence.y,
      duration: 200,
      ease: "Linear",
    });
  }

  removeOtherPlayer(accountId: string) {
    const sprite = this.otherPlayers.get(accountId);
    if (sprite) {
      sprite.destroy();
      this.otherPlayers.delete(accountId);
    }
    const label = this.nameLabels.get(accountId);
    if (label) {
      label.destroy();
      this.nameLabels.delete(accountId);
    }
  }

  // === Placement mode ===
  private placementCallback?: (gridX: number, gridY: number) => void;
  private placementPreview?: Phaser.GameObjects.Sprite;

  enterPlacementMode(objectType: string, callback: (gridX: number, gridY: number) => void) {
    this.placementCallback = callback;

    // Show a ghost preview following the mouse
    this.placementPreview = this.add.sprite(0, 0, objectType);
    this.placementPreview.setAlpha(0.5);
    this.placementPreview.setDepth(50);

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!this.placementPreview) return;
      const gridX = Math.floor(pointer.worldX / TILE_SIZE);
      const gridY = Math.floor(pointer.worldY / TILE_SIZE);
      this.placementPreview.setPosition(
        gridX * TILE_SIZE + TILE_SIZE / 2,
        gridY * TILE_SIZE + TILE_SIZE / 2
      );
    });
  }

  exitPlacementMode() {
    this.placementCallback = undefined;
    this.placementPreview?.destroy();
    this.placementPreview = undefined;
    this.input.off("pointermove");
  }
}
