import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../utils/Constants.js';

export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.maxX = 0;
    this.maxY = 0;
  }

  setBounds(levelWidth, levelHeight) {
    this.maxX = Math.max(0, levelWidth - SCREEN_WIDTH);
    this.maxY = Math.max(0, levelHeight - SCREEN_HEIGHT);
  }

  follow(target) {
    // Camera follows player, keeping them in left third of screen
    const targetX = target.x - SCREEN_WIDTH * 0.35;
    const targetY = target.y - SCREEN_HEIGHT * 0.5;

    this.x = Math.max(0, Math.min(this.maxX, targetX));
    this.y = Math.max(0, Math.min(this.maxY, targetY));

    // Camera only moves forward (classic Contra behavior)
    // Commented out for now to allow free camera
    // if (targetX > this.x) this.x = Math.min(this.maxX, targetX);
  }
}
