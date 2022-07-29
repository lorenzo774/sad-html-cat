import { Vector2 } from "./vector";

export abstract class Sprite {
  public flip: boolean = false;

  constructor(
    public img: HTMLImageElement,
    public pos: Vector2
  ) {}

  update() {}

  draw(ctx: CanvasRenderingContext2D) {
    if (this.flip) {
      // move to x + img's width
      ctx.translate(
        this.pos.x + this.img.width,
        this.pos.y
      );
      // scaleX by -1; this "trick" flips horizontally
      ctx.scale(-this.img.width / 20, this.img.height / 26);

      // draw the img
      // no need for x,y since we've already translated
      ctx.drawImage(this.img, 0, 0);

      // always clean up -- reset transformations to default
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      ctx.drawImage(
        this.img,
        this.pos.x,
        this.pos.y,
        this.img.width,
        this.img.height
      );
    }
  }
}
