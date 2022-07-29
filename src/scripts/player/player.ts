import { AnimatedSprite } from "../game/animatedsprite";
import { Animation } from "../game/animation";
import { CollisionBox } from "../game/collisionbox";
import { Input } from "../game/input";
import { Key } from "../game/key";
import { Settings } from "../game/settings";
import { Time } from "../game/time";
import { Vector2 } from "../game/vector";
import { loadImage } from "../utils/helper";

export class Player extends AnimatedSprite {
  private speed: number = 6;
  private jumpSpeed: number = 14;
  private canJump: boolean = true;
  private playerSize: Vector2;
  public _enabled: boolean = true;

  constructor(enabled: boolean = true) {
    const playerSize: Vector2 = new Vector2(100, 130);
    const playerPos = new Vector2(
      Settings.instance.CANVAS_WIDTH / 2 - playerSize.x / 2,
      Settings.instance.CANVAS_HEIGHT / 2 - playerSize.y / 2
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
    this._enabled = enabled;
    console.log(this._enabled);
  }

  // TODO: Create helper method to create animations
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

  private onTerrain(): boolean {
    return (
      this.pos.y + this.img.height + this.velocity.y >=
        Settings.instance.CANVAS_HEIGHT || this.isOnTerrain
    );
  }

  private fallingHandler() {
    if (this.onTerrain()) {
      console.log("ONTERRAIN");
      this.velocity.y = 0;
      if (!this.canJump) this.play("idle");
      this.canJump = true;
    } else {
      this.velocity.y +=
        Settings.instance.GRAVITY * Time.deltaTime * 100;
    }
  }

  private jump() {
    this.velocity.y -= this.jumpSpeed;
    this.play("jump");
    this.canJump = false;
  }

  update() {
    super.update();
    this.velocity.x = 0;

    if (this._enabled) {
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
    }

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

    // Sprite method
    this.updatePos();
  }
}
