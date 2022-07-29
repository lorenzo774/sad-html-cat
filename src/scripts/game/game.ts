import { Settings } from "./settings";
import { Sprite } from "./sprite";

export class Game {
  constructor(
    private context: CanvasRenderingContext2D,
    public sprites: Sprite[]
  ) {}

  update() {
    this.sprites.forEach((sprite) => sprite.update());
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
