export class Settings {
  // Singleton
  private static _instance: Settings;
  static get instance(): Settings {
    if (!Settings._instance) {
      Settings._instance = new Settings();
    }
    return Settings._instance;
  }

  // Settings
  CANVAS_WIDTH: number = 0;
  CANVAS_HEIGHT: number = 0;
  GRAVITY: number = 0.3;
}
