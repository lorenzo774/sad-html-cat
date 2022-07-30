import { Game } from "./scripts/game/game";
import { Input } from "./scripts/game/input";
import { Launcher } from "./scripts/game/launcher";
import { Settings } from "./scripts/game/settings";
import { Audio } from "./scripts/game/audio";
import "./style.css";
import jumpSound from "./assets/sounds/jump.wav";
import starSound from "./assets/sounds/star.wav";
import runSound from "./assets/sounds/run.wav";

function loadAudio() {
  // Set audio source
  const sourceJump = document.querySelector(
    "#source-jump"
  ) as HTMLSourceElement;
  Audio.jump.load();
  sourceJump.src = jumpSound;
  const sourceStar = document.querySelector(
    "#source-star"
  ) as HTMLSourceElement;
  sourceStar.src = starSound;
  Audio.star.load();
  const sourceRun = document.querySelector(
    "#source-run"
  ) as HTMLSourceElement;
  sourceRun.src = runSound;
  Audio.run.load();
}
loadAudio();

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
