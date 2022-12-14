import { Animation } from "./animation";
import { Sprite } from "./sprite";
import { Time } from "./time";
import { Vector2 } from "./vector";

interface AnimationData {
  timeLastFrame: number;
  animation: Animation;
}

export class AnimatedSprite extends Sprite {
  private maxFramesCounter: number = 0;
  private curFrameIndex: number = 0;
  public curAnimationData: AnimationData | undefined;
  public curAnimation: Animation | undefined;
  private _animationsData: AnimationData[] = [];
  private _animations: Animation[] = [];

  set animations(animations: Animation[]) {
    this._animations = animations;
    this._animationsData = this._animations.map(
      (animation) => {
        return {
          timeLastFrame:
            animation.timeLastFrame * Time.deltaTime,
          animation: new Animation(
            animation.name,
            animation.images,
            animation.frames,
            animation.timeLastFrame,
            animation.loop
          ),
        };
      }
    );
  }

  constructor(pos: Vector2, animations: Animation[]) {
    super(new Image(20, 26), pos);
    if (animations.length <= 0) return;

    this._animations = animations;
    this.maxFramesCounter = animations[0].frames;
    // Set animations data
  }

  private getAnimation(
    name: string
  ): Animation | undefined {
    return this._animations.find(
      (animation) => animation.name === name
    );
  }

  private setAnimatedSpriteData(firstFrame: number) {
    if (!this.curAnimationData) return;

    this.maxFramesCounter =
      this.curAnimationData.animation.frames;
    this.curFrameIndex = firstFrame;
    this.img =
      this.curAnimationData.animation.images[
        this.curFrameIndex
      ];
  }

  getAnimationData(
    name: string
  ): AnimationData | undefined {
    const animationData = this._animationsData.find(
      (animationData) =>
        animationData.animation.name === name
    );
    if (!animationData) return undefined;

    return animationData;
  }

  play(name: string, firstFrame: number = 0) {
    const animation = this.getAnimationData(name);
    if (animation === undefined) {
      this.curAnimationData = undefined;
      return;
    }
    if (firstFrame >= animation.animation.frames) return;

    this.curAnimation = this.getAnimation(name);
    this.curAnimationData = this.getAnimationData(name);
    this.setAnimatedSpriteData(firstFrame);
  }

  isPlaying(): boolean {
    return this.curAnimationData != undefined;
  }

  update() {
    if (
      this.curAnimationData &&
      this.curAnimationData.timeLastFrame <= 0
    ) {
      if (this.curFrameIndex + 1 >= this.maxFramesCounter) {
        this.curFrameIndex = 0;
        if (!this.curAnimationData.animation.loop) {
          this.curAnimationData = undefined;
          return;
        }
      } else {
        this.curFrameIndex += 1;
      }
      this.curAnimationData.timeLastFrame =
        this.curAnimationData.animation.timeLastFrame;
      this.img =
        this.curAnimationData.animation.images[
          this.curFrameIndex
        ];
    }
    if (!this.curAnimationData) return;
    this.curAnimationData.timeLastFrame -= Time.deltaTime;
    super.update();
  }
}
