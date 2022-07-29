import { Game } from "./scripts/game/game";
import { Input } from "./scripts/game/input";
import { Launcher } from "./scripts/game/launcher";
import { Settings } from "./scripts/game/settings";
import { Player } from "./scripts/player/player";

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

// GameObjects
const player = new Player();

// Input system
Input.listen();

// Launch
const game = new Game(context, [player]);
const launcher = new Launcher(game);
launcher.run();
