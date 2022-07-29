import { CollisionBox } from "./collisionbox";
import { Time } from "./time";
import { Vector2 } from "./vector";

export abstract class Sprite {
  public flip: boolean = false;
  public collider: CollisionBox | null = null;
  protected velocity: Vector2 = Vector2.ZERO;

  public isColliding: boolean = false;
  public isOnTerrain: boolean = false;

  constructor(
    public img: HTMLImageElement,
    public pos: Vector2
  ) {}

  update() {}

  protected updatePos() {
    if (!this.isColliding) {
      this.pos.x += this.velocity.x * Time.deltaTime * 100;
      this.pos.y += this.velocity.y * Time.deltaTime * 100;
    }
  }

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

  terrainCollision({ collider, pos }: Sprite): boolean {
    if (!this.collider || !collider) return false;
    this.isOnTerrain =
      this.pos.y +
        this.collider.offset.y +
        this.velocity.y <
        pos.y + collider.offset.y + collider.height &&
      this.pos.x +
        this.collider.offset.x +
        this.collider.width +
        this.velocity.x >
        pos.x + collider.offset.x;

    return this.isOnTerrain;
  }

  collide(other: Sprite) {
    if (!this.collider || !other.collider) return;

    if (
      this.xCollision(other) &&
      this.yCollision(other)
      // this.collider.offset.y > other.offset.y &&
      // this.collider.offset.y + this.collider.height <
      //   other.offset.y + other.height
    ) {
      this.isColliding = true;
    } else {
      this.isColliding = false;
    }
  }
}
