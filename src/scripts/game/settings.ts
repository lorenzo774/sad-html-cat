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
  FPS: number = 144;
  DEBUG_MODE: boolean = false;
  TERRAIN_HEIGHT: number = 637;
  START_SPAWNER_DELAY: number = 600;
}
