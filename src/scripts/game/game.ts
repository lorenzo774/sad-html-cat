import { Background } from "../objects/background";
import { Enemy } from "../objects/enemy";
import { Player } from "../objects/player";
import { Spawner } from "../objects/spawner";
import { Star } from "../objects/star";
import { Settings } from "./settings";
import { Sprite } from "./sprite";
import { Time } from "./time";
import { Audio } from "./audio";

export class Game {
  // DATA
  private points: number = 0;

  // Singleton
  private static _instance: Game;
  static get instance() {
    return Game._instance;
  }

  // GAME OBJECTS
  private context: CanvasRenderingContext2D | null = null;
  private sprites: Sprite[] = [];
  private spawners: Spawner<Sprite>[] = [];

  // UI
  private pointsCounter: HTMLElement | null = null;
  private hud: HTMLElement | null = null;
  private gameOverScreen: HTMLElement | null = null;
  private highscoreTxt: HTMLElement | null = null;

  static newGame(ctx: CanvasRenderingContext2D) {
    // GameObjects
    Time.time = 0;

    const background = new Background();
    const player = new Player();
    player.tag = "PLAYER";

    // Reload
    Game._instance = new Game();

    // UI
    Game._instance.pointsCounter =
      document.querySelector("#points");
    Game._instance.highscoreTxt =
      document.querySelector("#highscore");
    Game._instance.hud = document.querySelector(".hud");
    Game._instance.gameOverScreen = document.querySelector(
      ".game-over-screen"
    );

    if (Game._instance.hud) {
      Game._instance.hud.classList.remove("hide");
    }

    if (Game._instance.gameOverScreen) {
      Game._instance.gameOverScreen.classList.add("hide");
    }

    Game._instance.setContext(ctx);
    Game._instance.addSprites([background, player]);

    // Spawners
    Game._instance.setSpawners([
      new Spawner(
        Settings.instance.START_SPAWNER_DELAY,
        Enemy
      ),
      new Spawner(
        Settings.instance.START_SPAWNER_DELAY,
        Star
      ),
    ]);
  }

  setSpawners(spawners: Spawner<Sprite>[]) {
    this.spawners = spawners;
  }

  addPoint(amount: number) {
    this.points += amount;
  }

  setContext(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  addSprites(_sprites: Sprite[]) {
    this.sprites.push(..._sprites);
  }

  remove(tag: string) {
    this.sprites = this.sprites.filter(
      (s) => s.tag !== tag
    );
  }

  gameOver() {
    // Remove interval
    this.spawners.forEach((spawner) =>
      spawner.removeIntervals()
    );

    if (!this.gameOverScreen) return;
    if (!this.hud) return;

    this.gameOverScreen.classList.remove("hide");
    this.hud.classList.add("hide");

    if (
      this.points >
      Number(localStorage.getItem("highscore"))
    ) {
      localStorage.setItem(
        "highscore",
        String(this.points)
      );
    }

    if (this.highscoreTxt) {
      this.highscoreTxt.innerHTML =
        "HIGH SCORE: " +
        Number(localStorage.getItem("highscore"));
    }

    Audio.run.pause();

    const sprite = this.sprites.find(
      (sprite) => sprite instanceof Player
    ) as Player;
    sprite.enabled = false;
  }

  update() {
    this.sprites.forEach((sprite) => {
      sprite.update();
      this.sprites.forEach((other) => {
        // Check every collision, not the one of the player
        if (
          JSON.stringify(other) !==
            JSON.stringify(sprite) &&
          other.collider
        )
          sprite.collide(other);
      });
    });

    if (this.pointsCounter) {
      this.pointsCounter.innerHTML = `${this.points}`;
    }
  }

  clear() {
    if (!this.context) return;

    this.context.beginPath();
  }

  drawDebug() {
    if (!this.context) return;

    this.sprites.forEach((sprite) =>
      sprite.drawDebug(
        this.context as CanvasRenderingContext2D
      )
    );
  }

  draw() {
    if (!this.context) return;

    this.context.clearRect(
      0,
      0,
      Settings.instance.CANVAS_WIDTH,
      Settings.instance.CANVAS_HEIGHT
    );
    this.sprites.forEach((sprite) =>
      sprite.draw(this.context as CanvasRenderingContext2D)
    );
  }
}
