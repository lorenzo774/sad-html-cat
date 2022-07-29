import { Settings } from "./settings";
import { Sprite } from "./sprite";

export class Game {
  constructor(
    private context: CanvasRenderingContext2D,
    public sprites: Sprite[]
  ) {}

  update() {
    this.sprites.forEach((sprite) => {
      sprite.update();
      this.sprites.forEach((other) => {
        // Check every collision, not the one of the player
        if (
          JSON.stringify(other) !==
            JSON.stringify(sprite) &&
          other.collider
        )
          sprite.collide(other);
      });
    });
  }

  clear() {
    this.context.beginPath();
  }

  drawDebug() {
    this.sprites.forEach((sprite) =>
      sprite.drawDebug(this.context)
    );
  }

  draw() {
    this.context.clearRect(
      0,
      0,
      Settings.instance.CANVAS_WIDTH,
      Settings.instance.CANVAS_HEIGHT
    );
    this.sprites.forEach((sprite) =>
      sprite.draw(this.context)
    );
  }
}
