import { Game } from "./game";
import { Settings } from "./settings";

export class Launcher {
  private fixedDelta: number = 0;
  private then: number;
  private now: number = 0;
  private dif: number = 0;

  constructor(private game: Game) {
    this.fixedDelta = Settings.instance.FPS;
    this.then = Date.now();
  }

  render() {
    this.game.update();
    this.game.draw();

    const fpsCounter =
      document.querySelector("#fps-counter");
    if (fpsCounter) {
      fpsCounter.innerHTML = `FPS: ${(
        1 /
        (this.dif / 1000)
      ).toFixed(0)}`;
    }
    this.then = this.now;
  }

  run() {
    this.now = Date.now();
    this.dif = this.now - this.then;

    if (this.dif > 1000 / this.fixedDelta) {
      this.render();
    }

    requestAnimationFrame(this.run.bind(this));
  }
}
