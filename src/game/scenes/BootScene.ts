import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    // Generate placeholder textures (replace with real assets later)
    this.generateTextures();
  }

  create() {
    this.scene.start("FarmScene");
  }

  private generateTextures() {
    // Player
    const playerGfx = this.add.graphics();
    playerGfx.fillStyle(0x4488ff);
    playerGfx.fillCircle(16, 16, 14);
    playerGfx.generateTexture("player", 32, 32);
    playerGfx.destroy();

    // Other player
    const otherGfx = this.add.graphics();
    otherGfx.fillStyle(0x88ff44);
    otherGfx.fillCircle(16, 16, 14);
    otherGfx.generateTexture("other_player", 32, 32);
    otherGfx.destroy();

    // Grass tile
    const grassGfx = this.add.graphics();
    grassGfx.fillStyle(0x3a7d44);
    grassGfx.fillRect(0, 0, 64, 64);
    grassGfx.lineStyle(1, 0x2d6b35);
    grassGfx.strokeRect(0, 0, 64, 64);
    grassGfx.generateTexture("grass", 64, 64);
    grassGfx.destroy();

    // Object textures
    const objects: [string, number][] = [
      ["tree", 0x228b22],
      ["mine", 0x808080],
      ["field", 0xdaa520],
      ["gold_mine", 0xffd700],
      ["iron_mine", 0x8b8682],
    ];

    for (const [key, color] of objects) {
      const g = this.add.graphics();
      g.fillStyle(color);
      g.fillRoundedRect(4, 4, 56, 56, 8);
      g.generateTexture(key, 64, 64);
      g.destroy();
    }
  }
}
