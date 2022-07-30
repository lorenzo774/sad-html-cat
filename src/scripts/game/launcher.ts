import { Game } from "./game";
import { Settings } from "./settings";
import { Time } from "./time";

export class Launcher {
  private fixedDelta: number = 0;
  private then: number;
  private now: number = 0;
  private dif: number = 0;

  constructor() {
    this.fixedDelta = Settings.instance.FPS;
    this.then = Date.now();
    this.now = Date.now();
  }

  render() {
    this.then = this.now;
    this.now = Date.now();
    this.dif = this.now - this.then;
    Time.deltaTime = this.dif / 1000;
    Time.time += Time.deltaTime;

    // Draw
    Game.instance.update();
    Game.instance.clear();
    Game.instance.draw();
    // Draw collisionbox on debug mode
    if (Settings.instance.DEBUG_MODE)
      Game.instance.drawDebug();

    this.then = this.now;
  }

  run() {
    setInterval(() => {
      this.render();
    }, 1000 / this.fixedDelta);
  }
}
