import { AnimatedSprite } from "../game/animatedsprite";
import { Animation } from "../game/animation";
import { Input } from "../game/input";
import { Key } from "../game/key";
import { Settings } from "../game/settings";
import { Vector2 } from "../game/vector";
import { loadImage } from "../utils/helper";

export class Player extends AnimatedSprite {
  private speed: number = 8;
  private jumpSpeed: number = 13;
  private velocity: Vector2 = Vector2.ZERO;
  private canJump: boolean = true;
  private playerSize: Vector2;

  constructor() {
    const playerSize: Vector2 = new Vector2(100, 130);
    const playerPos = new Vector2(
      Settings.instance.CANVAS_WIDTH / 2 - playerSize.x / 2,
      Settings.instance.CANVAS_HEIGHT / 2 - playerSize.y / 2
    );

    super(playerPos, []);
    this.playerSize = playerSize;
    this.animations = this.createAnimations();
    this.play("idle");
  }

  private createAnimations(): Animation[] {
    const idleImg = loadImage(
      "../../assets/sprites_mario000.png",
      this.playerSize.x,
      this.playerSize.y
    );

    const idle = new Animation(
      "idle",
      [idleImg as HTMLImageElement],
      1,
      10
    );

    const run = new Animation(
      "run",
      [
        idleImg,
        loadImage(
          "../../assets/sprites_mario001.png",
          this.playerSize.x,
          this.playerSize.y
        ),
      ] as HTMLImageElement[],
      2,
      5,
      true
    );
    const jump = new Animation(
      "jump",
      [
        loadImage(
          "../../assets/sprites_mario002.png",
          this.playerSize.x,
          this.playerSize.y
        ),
        loadImage(
          "../../assets/sprites_mario003.png",
          this.playerSize.x,
          this.playerSize.y
        ),
      ] as HTMLImageElement[],
      2,
      40,
      false
    );
    return [idle, run, jump];
  }

  private inBounds(): boolean {
    return (
      this.pos.y + this.img.height + this.velocity.y <
      Settings.instance.CANVAS_HEIGHT
    );
  }

  private fallingHandler() {
    if (this.inBounds()) {
      this.velocity.y += Settings.instance.GRAVITY;
    } else {
      this.velocity.y = 0;
      this.canJump = true;
    }
  }

  private jump() {
    this.velocity.y = -this.jumpSpeed;
    this.play("jump");
    this.canJump = false;
  }

  update() {
    super.update();

    this.velocity.x = 0;

    if (Input.isPressed(Key.A)) {
      this.velocity.x = -this.speed;
      this.flip = true;
    }
    if (Input.isPressed(Key.D)) {
      this.velocity.x = this.speed;
      this.flip = false;
    }
    if (Input.justPressed(Key.SPACE) && this.canJump)
      this.jump();

    // Run animations
    if (
      this.velocity.x !== 0 &&
      !this.isPlaying() &&
      this.canJump
    )
      this.play("run", 1);
    else if (this.velocity.x === 0 && this.velocity.y === 0)
      this.play("idle");

    // Create gravity
    this.fallingHandler();

    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
  }
}
