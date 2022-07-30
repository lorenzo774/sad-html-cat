import { Sprite } from "../game/sprite";
import { Vector2 } from "../game/vector";
import { loadImage } from "../utils/helper";

export class Background extends Sprite {
  /**
   *
   */
  constructor() {
    super(
      loadImage(
        "../../assets/bg.png",
        1280,
        720
      ) as HTMLImageElement,
      Vector2.ZERO
    );
  }
}
