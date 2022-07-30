import { Game } from "./scripts/game/game";
import { Input } from "./scripts/game/input";
import { Launcher } from "./scripts/game/launcher";
import { Settings } from "./scripts/game/settings";
import { Audio } from "./scripts/game/audio";

// HTML5 Canvas setup
const canvas = document.querySelector(
  "#game"
) as HTMLCanvasElement;
const context = canvas.getContext(
  "2d"
) as CanvasRenderingContext2D;
context.imageSmoothingEnabled = false;

// Settings
Settings.instance.CANVAS_WIDTH = canvas.width;
Settings.instance.CANVAS_HEIGHT = canvas.height;

Audio.run.playbackRate = 1.6;

// Input system
Input.listen();

// Load new game
Game.newGame(context);

let launcher = new Launcher();
launcher.run();

const tryAgainBtn = document.querySelector(
  "#try-again"
) as HTMLButtonElement;

if (tryAgainBtn) {
  tryAgainBtn.addEventListener("click", () => {
    Game.newGame(context);
  });
}
