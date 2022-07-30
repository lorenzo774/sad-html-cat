import { Sprite } from "../game/sprite";
import { Vector2 } from "../game/vector";
import { loadImage } from "../utils/helper";
import bg from "../../assets/bg.png";

export class Background extends Sprite {
  /**
   *
   */
  constructor() {
    super(
      loadImage(bg, 1280, 720) as HTMLImageElement,
      Vector2.ZERO
    );
  }
}
