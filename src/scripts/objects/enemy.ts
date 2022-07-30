import { CollisionBox } from "../game/collisionbox";
import { Game } from "../game/game";
import { Settings } from "../game/settings";
import { Sprite } from "../game/sprite";
import { Vector2 } from "../game/vector";
import { loadImage } from "../utils/helper";
import goomba from "../../assets/goomba.png";

export class Enemy extends Sprite {
  constructor() {
    super(
      loadImage(goomba, 60, 60) as HTMLImageElement,
      new Vector2(0, 0)
    );
    this.pos.y = -this.img.height;
    this.gravity = Settings.instance.GRAVITY / 6;
    this.tag = `enemy-${Math.random()}`;
    this.collider = new CollisionBox(60, 60, Vector2.ZERO);
  }

  update() {
    if (!this.collider) return;

    if (
      this.pos.y + this.collider.height >=
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
