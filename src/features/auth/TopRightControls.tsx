import { NearWalletButton } from "../near/NearWalletButton";
import { AuthScreen } from "./AuthScreen";

/**
 * Wraps NEAR + Email login into one row that floats below the HUD,
 * pinned to top-right but offset down so it doesn't overlap HUD buttons.
 */
export function TopRightControls() {
  return (
    <div className="absolute z-40 flex items-center gap-1" style={{ top: 84, right: 8 }}>
      <NearWalletButton />
      <AuthScreen />
    </div>
  );
}
