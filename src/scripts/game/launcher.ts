import { Game } from "./game";

export class Launcher {
  constructor(private game: Game) {}

  run() {
    this.game.update();
    this.game.draw();
    requestAnimationFrame(this.run.bind(this));
  }
}
