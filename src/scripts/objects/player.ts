import { AnimatedSprite } from "../game/animatedsprite";
import { Animation } from "../game/animation";
import { CollisionBox } from "../game/collisionbox";
import { Input } from "../game/input";
import { Key } from "../game/key";
import { Settings } from "../game/settings";
import { Vector2 } from "../game/vector";
import { loadImage } from "../utils/helper";
import { Audio } from "../game/audio";

export class Player extends AnimatedSprite {
  private speed: number = 6;
  private maxSpeed: number = 11;
  private jumpSpeed: number = 14;
  private canJump: boolean = true;
  private playerSize: Vector2;

  public enabled: boolean = true;

  constructor() {
    const playerSize: Vector2 = new Vector2(100, 130);
    const playerPos = new Vector2(
      Settings.instance.CANVAS_WIDTH / 2 - playerSize.x / 2,
      Settings.instance.TERRAIN_HEIGHT - playerSize.y
    );

    super(playerPos, []);
    this.playerSize = playerSize;
    this.animations = this.createAnimations();
    this.collider = new CollisionBox(
      70,
      100,
      new Vector2(24, 30)
    );
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
      0.1
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
      0.08,
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
      0.9,
      false
    );
    return [idle, run, jump];
  }

  private jump() {
    this.velocity.y -= this.jumpSpeed;
    this.play("jump");
    Audio.jump.play();
    this.canJump = false;
  }

  private getSpeed(): number {
    const curSpeed = Input.isPressed(Key.SHIFT)
      ? this.maxSpeed
      : this.speed;

    // Multiply animation speed
    if (this.curAnimationData && this.curAnimation) {
      this.curAnimationData.animation.timeLastFrame =
        this.curAnimation.timeLastFrame *
        (this.speed / curSpeed);
    }
    return curSpeed;
  }

  update() {
    super.update();

    this.velocity.x = 0;

    const speed = this.getSpeed();

    if (this.enabled) {
      if (Input.isPressed(Key.A)) {
        this.velocity.x = -speed;
        this.flip = true;
      }
      if (Input.isPressed(Key.D)) {
        this.velocity.x = speed;

        this.flip = false;
      }
      if (Input.justPressed(Key.SPACE) && this.canJump)
        this.jump();
      if (
        this.velocity.x !== 0 &&
        !this.isPlaying() &&
        this.canJump
      ) {
        // Run animations
        this.play("run", 1);
      } else if (
        this.velocity.x === 0 &&
        this.velocity.y === 0
      ) {
        this.play("idle");
        Audio.run.pause();
      }
    } else {
      this.play("idle");
    }

    if (this.velocity.y === 0 && this.velocity.x !== 0) {
      Audio.run.play();
    } else {
      Audio.run.pause();
    }

    // Clamp player to canvas
    if (
      this.pos.x + this.velocity.x < 0 ||
      this.pos.x + this.velocity.x + this.img.width >
        Settings.instance.CANVAS_WIDTH
    ) {
      this.velocity.x = 0;
    }

    // Sprite method
    this.updatePos(() => {
      if (!this.canJump) this.play("idle");
      this.canJump = true;
    });
  }
}
