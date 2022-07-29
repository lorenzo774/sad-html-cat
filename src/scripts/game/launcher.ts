import { Game } from "./game";
import { Settings } from "./settings";
import { Time } from "./time";

export class Launcher {
  private fixedDelta: number = 0;
  private then: number;
  private now: number = 0;
  private dif: number = 0;
  private fpsCounter: HTMLElement | null;

  constructor(private game: Game) {
    this.fixedDelta = Settings.instance.FPS;
    this.then = Date.now();
    this.now = Date.now();
    this.fpsCounter =
      document.querySelector("#fps-counter");
  }

  render() {
    this.then = this.now;
    this.now = Date.now();
    this.dif = this.now - this.then;
    Time.deltaTime = this.dif / 1000;

    // Draw
    this.game.update();
    this.game.clear();
    this.game.draw();

    const fps = 1 / (this.dif / 1000);

    if (this.fpsCounter) {
      this.fpsCounter.innerHTML = `FPS: ${fps.toFixed(0)}`;
    }

    this.then = this.now;
  }

  run() {
    setInterval(() => {
      this.render();
    }, 1000 / this.fixedDelta);
  }
}
