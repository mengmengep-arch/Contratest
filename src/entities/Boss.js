import { Entity } from './Entity.js';
import { Bullet } from '../weapons/Bullet.js';
import { ENEMY_BULLET_SPEED, COLORS } from '../utils/Constants.js';
import { BOSS_CORE } from '../rendering/Sprites.js';

export class Boss extends Entity {
  constructor(x, y) {
    super(x, y, 48, 48);
    this.maxHealth = 50;
    this.health = this.maxHealth;
    this.phase = 0; // 0, 1, 2
    this.scoreValue = 10000;
    this.shootTimer = 0;
    this.patternTimer = 0;
    this.pattern = 0;
    this.alive = true;
    this.flashTimer = 0;
    this.deathTimer = 0;
    this.dying = false;

    // Sub-targets (weak points)
    this.weakPoints = [
      { x: x + 8, y: y + 16, health: 10, alive: true, shootTimer: 0 },
      { x: x + 32, y: y + 16, health: 10, alive: true, shootTimer: 0 },
      { x: x + 20, y: y + 8, health: 15, alive: true, shootTimer: 0 },  // Core
    ];
  }

  update(playerX, playerY) {
    if (this.dying) {
      this.deathTimer++;
      return this.deathTimer > 120 ? 'dead' : 'dying';
    }

    this.patternTimer++;
    this.flashTimer--;

    const bullets = [];

    for (const wp of this.weakPoints) {
      if (!wp.alive) continue;

      wp.shootTimer--;
      if (wp.shootTimer <= 0) {
        // Different patterns per phase
        const rate = this.phase === 0 ? 60 : this.phase === 1 ? 40 : 25;
        wp.shootTimer = rate;

        if (this.phase >= 2) {
          // Spread pattern
          for (let i = -2; i <= 2; i++) {
            const angle = Math.atan2(playerY - wp.y, playerX - wp.x) + i * 0.3;
            bullets.push(new Bullet(
              wp.x, wp.y,
              Math.cos(angle) * ENEMY_BULLET_SPEED,
              Math.sin(angle) * ENEMY_BULLET_SPEED,
              true
            ));
          }
        } else if (this.phase >= 1) {
          // Triple shot
          for (let i = -1; i <= 1; i++) {
            const angle = Math.atan2(playerY - wp.y, playerX - wp.x) + i * 0.2;
            bullets.push(new Bullet(
              wp.x, wp.y,
              Math.cos(angle) * ENEMY_BULLET_SPEED,
              Math.sin(angle) * ENEMY_BULLET_SPEED,
              true
            ));
          }
        } else {
          // Single aimed shot
          const dx = playerX - wp.x;
          const dy = playerY - wp.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0) {
            bullets.push(new Bullet(
              wp.x, wp.y,
              (dx / dist) * ENEMY_BULLET_SPEED,
              (dy / dist) * ENEMY_BULLET_SPEED,
              true
            ));
          }
        }
      }
    }

    // Check phase transitions
    const totalHP = this.weakPoints.reduce((sum, wp) => sum + (wp.alive ? wp.health : 0), 0);
    if (totalHP <= 20 && this.phase < 1) this.phase = 1;
    if (totalHP <= 10 && this.phase < 2) this.phase = 2;

    // Check if all weak points dead
    if (this.weakPoints.every(wp => !wp.alive) && !this.dying) {
      this.dying = true;
      this.deathTimer = 0;
    }

    return bullets;
  }

  hitWeakPoint(bulletX, bulletY, damage = 1) {
    for (const wp of this.weakPoints) {
      if (!wp.alive) continue;
      if (Math.abs(bulletX - wp.x) < 10 && Math.abs(bulletY - wp.y) < 10) {
        wp.health -= damage;
        this.flashTimer = 4;
        if (wp.health <= 0) {
          wp.alive = false;
        }
        return true;
      }
    }
    return false;
  }

  draw(renderer, camX, camY, particles) {
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);

    if (this.dying) {
      // Explosion sequence
      if (this.deathTimer % 8 === 0) {
        const ex = this.x + Math.random() * this.width;
        const ey = this.y + Math.random() * this.height;
        particles.explosion(ex, ey);
      }
      return;
    }

    // Draw boss structure - metal wall
    renderer.drawRect(sx - 8, sy - 8, 64, 64, COLORS.DARK_METAL);
    renderer.drawRect(sx - 4, sy - 4, 56, 56, COLORS.METAL);

    // Draw boss core sprite
    renderer.drawSprite(BOSS_CORE, sx + 4, sy + 10, false);

    // Draw weak points
    for (const wp of this.weakPoints) {
      if (!wp.alive) continue;
      const wpx = Math.round(wp.x - camX);
      const wpy = Math.round(wp.y - camY);

      // Flash when hit
      const color = this.flashTimer > 0 ? '#fcfcfc' : COLORS.RED;
      renderer.drawCircle(wpx, wpy, 5, color);
      renderer.drawCircle(wpx, wpy, 3, '#fc9838');

      // Health indicator
      const hpRatio = wp.health / 15;
      renderer.drawRect(wpx - 5, wpy - 8, 10 * hpRatio, 2, COLORS.GREEN);
    }
  }
}
