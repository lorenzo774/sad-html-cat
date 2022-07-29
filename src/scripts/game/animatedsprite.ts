import { Animation } from "./animation";
import { Sprite } from "./sprite";
import { Vector2 } from "./vector";

export class AnimatedSprite extends Sprite {
  private maxFramesCounter: number = 0;
  private curFrameIndex: number = 0;
  private curAnimation: Animation | undefined;
  private timeLastFrame: number = 0;
  public animations: Animation[] = [];

  constructor(pos: Vector2, animations: Animation[]) {
    super(new Image(20, 26), pos);
    if (animations.length <= 0) return;

    this.animations = animations;
    this.maxFramesCounter = animations[0].frames;
  }

  private getAnimation(
    name: string
  ): Animation | undefined {
    return this.animations.find(
      (animation) => animation.name === name
    );
  }

  play(name: string, firstFrame: number = 0) {
    const animation = this.getAnimation(name);
    if (animation === undefined) {
      this.curAnimation = undefined;
      return;
    }

    if (firstFrame >= animation.frames) return;

    this.curAnimation = animation;
    this.timeLastFrame = this.curAnimation.timeLastFrame;
    this.maxFramesCounter = this.curAnimation.frames;
    this.curFrameIndex = firstFrame;
    this.img = this.curAnimation.images[this.curFrameIndex];
  }

  isPlaying(): boolean {
    return this.curAnimation != undefined;
  }

  update() {
    if (this.curAnimation && this.timeLastFrame <= 0) {
      if (this.curFrameIndex + 1 >= this.maxFramesCounter) {
        this.curFrameIndex = 0;
        if (!this.curAnimation.loop) {
          this.curAnimation = undefined;
          return;
        }
      } else {
        this.curFrameIndex += 1;
      }
      this.timeLastFrame = this.curAnimation.timeLastFrame;
      this.img =
        this.curAnimation.images[this.curFrameIndex];
    }
    this.timeLastFrame--;
  }
}
