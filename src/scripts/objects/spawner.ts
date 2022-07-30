import { Game } from "../game/game";
import { Sprite } from "../game/sprite";
import { Time } from "../game/time";

export class Spawner<T extends Sprite> {
  private interval: number = 0;
  private changeMSInterval: number = 0;

  constructor(
    public ms: number,
    private newable: new () => T
  ) {
    this.interval = setInterval(
      this.spawn.bind(this),
      this.ms
    );
    this.changeMSInterval = setInterval(() => {
      clearInterval(this.interval);
      const rnd = Math.floor(Time.time / 6) + 1;
      this.ms -= rnd - rnd * 0.18;
      this.interval = setInterval(
        this.spawn.bind(this),
        this.ms
      );
    }, 6000);
  }

  public removeIntervals() {
    clearInterval(this.interval);
    clearInterval(this.changeMSInterval);
  }

  private spawn() {
    const enemy = new this.newable();
    enemy.pos.x = Math.floor(Math.random() * 1280);
    Game.instance.addSprites([enemy]);
  }
}
