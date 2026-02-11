import { Entity } from '../entities/Entity.js';
import { WEAPON, COLORS } from '../utils/Constants.js';
import { POWERUP_CAPSULE } from '../rendering/Sprites.js';

export class PowerUp extends Entity {
  constructor(x, y, type = WEAPON.SPREAD) {
    super(x, y, 10, 8);
    this.type = type;
    this.vx = -0.8;
    this.vy = 0;
    this.bobTimer = 0;
    this.baseY = y;
    this.scoreValue = 500;
  }

  update() {
    this.x += this.vx;
    this.bobTimer += 0.05;
    this.y = this.baseY + Math.sin(this.bobTimer) * 4;

    // Off screen
    if (this.x < -20 || this.x > 5000) this.dead = true;
  }

  getLabel() {
    switch (this.type) {
      case WEAPON.SPREAD: return 'S';
      case WEAPON.MACHINE: return 'M';
      case WEAPON.LASER: return 'L';
      default: return '?';
    }
  }

  draw(renderer, camX, camY) {
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    renderer.drawSprite(POWERUP_CAPSULE, sx, sy, false);
    // Letter on capsule
    renderer.drawText(this.getLabel(), sx + 3, sy + 1, COLORS.BLUE, 6);
  }
}

export class FlyingCapsule extends Entity {
  constructor(x, y, weaponType) {
    super(x, y, 16, 12);
    this.weaponType = weaponType;
    this.health = 3;
    this.vx = -1;
    this.vy = 0;
    this.bobTimer = Math.random() * Math.PI * 2;
    this.baseY = y;
    this.scoreValue = 300;
  }

  update() {
    this.x += this.vx;
    this.bobTimer += 0.03;
    this.y = this.baseY + Math.sin(this.bobTimer) * 8;

    if (this.x < -30) this.dead = true;
  }

  hit() {
    this.health--;
    if (this.health <= 0) {
      this.dead = true;
      return new PowerUp(this.x, this.y, this.weaponType);
    }
    return null;
  }

  draw(renderer, camX, camY) {
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    // Flying capsule - blinking red orb
    const blink = Math.floor(this.bobTimer * 10) % 2 === 0;
    renderer.drawRect(sx, sy, 16, 10, blink ? COLORS.RED : '#880000');
    renderer.drawRect(sx + 2, sy + 2, 12, 6, COLORS.WHITE);
    renderer.drawText(this.getLabel(), sx + 5, sy + 2, COLORS.RED, 6);
  }

  getLabel() {
    switch (this.weaponType) {
      case WEAPON.SPREAD: return 'S';
      case WEAPON.MACHINE: return 'M';
      case WEAPON.LASER: return 'L';
      default: return 'R';
    }
  }
}
