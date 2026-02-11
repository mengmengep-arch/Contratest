import { WEAPON, BULLET_SPEED } from '../utils/Constants.js';
import { Bullet, SpreadBullet, LaserBeam } from './Bullet.js';

export class Weapon {
  constructor(type = WEAPON.RIFLE) {
    this.type = type;
    this.cooldown = 0;
    this.fireRate = this.getFireRate();
  }

  getFireRate() {
    switch (this.type) {
      case WEAPON.RIFLE: return 12;
      case WEAPON.SPREAD: return 15;
      case WEAPON.MACHINE: return 4;
      case WEAPON.LASER: return 20;
      default: return 12;
    }
  }

  canFire() {
    return this.cooldown <= 0;
  }

  fire(x, y, dirX, dirY) {
    if (!this.canFire()) return [];
    this.cooldown = this.fireRate;

    const bullets = [];

    switch (this.type) {
      case WEAPON.RIFLE:
        bullets.push(new Bullet(x, y, dirX * BULLET_SPEED, dirY * BULLET_SPEED));
        break;

      case WEAPON.MACHINE:
        bullets.push(new Bullet(x, y, dirX * BULLET_SPEED * 1.2, dirY * BULLET_SPEED * 1.2));
        break;

      case WEAPON.SPREAD: {
        // 5 bullets in a fan pattern
        const baseAngle = Math.atan2(dirY, dirX);
        const spreadAngle = 0.15;
        for (let i = -2; i <= 2; i++) {
          const angle = baseAngle + i * spreadAngle;
          const bvx = Math.cos(angle) * BULLET_SPEED;
          const bvy = Math.sin(angle) * BULLET_SPEED;
          bullets.push(new SpreadBullet(x, y, bvx, bvy));
        }
        break;
      }

      case WEAPON.LASER:
        bullets.push(new LaserBeam(x, y, dirX * BULLET_SPEED * 1.5, dirY * BULLET_SPEED * 1.5));
        break;
    }

    return bullets;
  }

  update() {
    if (this.cooldown > 0) this.cooldown--;
  }
}
