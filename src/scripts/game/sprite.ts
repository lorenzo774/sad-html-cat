import { CollisionBox } from "./collisionbox";
import { Settings } from "./settings";
import { Time } from "./time";
import { Vector2 } from "./vector";

export abstract class Sprite {
  protected velocity: Vector2 = Vector2.ZERO;

  public flip: boolean = false;
  public collider: CollisionBox | null = null;
  public tag: string = "";
  public gravity: number = 0;
  public colliderTag: string = "";

  public isColliding: boolean = false;
  public isOnTerrain: boolean = false;

  constructor(
    public img: HTMLImageElement,
    public pos: Vector2
  ) {
    this.gravity = Settings.instance.GRAVITY;
  }

  private onTerrain(): boolean {
    return (
      this.pos.y + this.img.height + this.velocity.y >=
      Settings.instance.TERRAIN_HEIGHT
    );
  }

  update() {}

  protected updatePos(func: () => void) {
    if (this.isColliding || this.onTerrain()) {
      this.velocity.y = 0;
      func();
    } else {
      this.velocity.y +=
        this.gravity * Time.deltaTime * 100;
    }
    this.pos.x += this.velocity.x * Time.deltaTime * 100;
    this.pos.y += this.velocity.y * Time.deltaTime * 100;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.flip) {
      // move to x + img's width
      ctx.translate(
        this.pos.x + this.img.width,
        this.pos.y
      );
      // scaleX by -1; this "trick" flips horizontally
      ctx.scale(-this.img.width / 32, this.img.height / 32);

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

  drawDebug(ctx: CanvasRenderingContext2D): void {
    if (!this.collider) return;

    ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
    ctx.fillRect(
      this.collider.offset.x + this.pos.x,
      this.collider.offset.y + this.pos.y,
      this.collider.width,
      this.collider.height
    );
  }

  private xCollision({ collider, pos }: Sprite): boolean {
    if (!this.collider || !collider) return false;

    return (
      this.pos.x +
        this.collider.offset.x +
        this.collider.width +
        this.velocity.x >
        pos.x + collider.offset.x &&
      this.pos.x +
        this.collider.offset.x +
        this.velocity.x <
        pos.x + collider.offset.x + collider.width
    );
  }

  private yCollision(other: Sprite): boolean {
    const { collider, pos } = other;
    if (!this.collider || !collider) return false;

    return (
      this.pos.y +
        this.collider.offset.y +
        this.collider.height +
        this.velocity.y >
        pos.y + collider.offset.y &&
      this.pos.y +
        this.collider.offset.y +
        this.velocity.y <
        pos.y + collider.offset.y + collider.height
    );
  }

  collide(other: Sprite) {
    if (!this.collider || !other.collider) return;

    this.isColliding =
      this.xCollision(other) && this.yCollision(other);

    if (this.isColliding) {
      this.colliderTag = other.tag;
    }
  }
}
