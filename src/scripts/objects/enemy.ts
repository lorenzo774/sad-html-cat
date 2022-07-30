import { CollisionBox } from "../game/collisionbox";
import { Game } from "../game/game";
import { Settings } from "../game/settings";
import { Sprite } from "../game/sprite";
import { Vector2 } from "../game/vector";
import { loadImage } from "../utils/helper";
import box from "../../assets/box.png";

export class Enemy extends Sprite {
  constructor() {
    super(
      loadImage(box, 100, 100) as HTMLImageElement,
      new Vector2(0, 0)
    );
    this.pos.y = -this.img.height;
    this.gravity = Settings.instance.GRAVITY / 6;
    this.tag = `enemy-${Math.random()}`;
    this.collider = new CollisionBox(
      70,
      70,
      new Vector2(15, 15)
    );
  }

  update() {
    if (!this.collider) return;

    console.log(`${this.pos.y + this.collider.height}`);
    if (
      this.pos.y +
        this.collider.height +
        this.collider.offset.y * 2 >=
      Settings.instance.TERRAIN_HEIGHT
    ) {
      Game.instance.remove(this.tag);
    }

    if (this.colliderTag === "PLAYER") {
      Game.instance.gameOver();
    }

    this.updatePos(() => {});
  }
}
