import { Entity } from '../entities/Entity.js';
import { COLORS } from '../utils/Constants.js';

export class Bullet extends Entity {
  constructor(x, y, vx, vy, isEnemy = false, damage = 1) {
    super(x, y, 3, 3);
    this.vx = vx;
    this.vy = vy;
    this.isEnemy = isEnemy;
    this.damage = damage;
    this.life = 180; // frames before auto-destroy
    this.color = isEnemy ? COLORS.BULLET_ENEMY : COLORS.BULLET;
    this.size = isEnemy ? 2 : 2;
    this.pierce = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    if (this.life <= 0) this.dead = true;
  }

  draw(renderer, camX, camY) {
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    renderer.drawRect(sx, sy, this.size, this.size, this.color);
    // Glow effect
    if (!this.isEnemy) {
      renderer.drawRect(sx - 1, sy, 1, this.size, '#fc9838');
    }
  }
}

export class LaserBeam extends Bullet {
  constructor(x, y, vx, vy) {
    super(x, y, vx, vy, false, 3);
    this.width = Math.abs(vx) > Math.abs(vy) ? 12 : 3;
    this.height = Math.abs(vy) > Math.abs(vx) ? 12 : 3;
    this.color = '#fc4468';
    this.pierce = true;
    this.life = 120;
  }

  draw(renderer, camX, camY) {
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    renderer.drawRect(sx, sy, this.width, this.height, this.color);
    renderer.drawRect(sx + 1, sy + 1, this.width - 2, this.height - 2, '#fcfcfc');
  }
}

export class SpreadBullet extends Bullet {
  constructor(x, y, vx, vy) {
    super(x, y, vx, vy, false, 1);
    this.color = '#fcfcfc';
    this.size = 3;
  }

  draw(renderer, camX, camY) {
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    renderer.drawCircle(sx + 1, sy + 1, 2, this.color);
  }
}
