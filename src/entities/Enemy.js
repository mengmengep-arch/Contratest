import { Entity } from './Entity.js';
import { Bullet } from '../weapons/Bullet.js';
import { ENEMY_BULLET_SPEED, TILE_SIZE, GRAVITY } from '../utils/Constants.js';
import { ENEMY_SOLDIER, ENEMY_SNIPER, TURRET_SPRITE } from '../rendering/Sprites.js';

export class Soldier extends Entity {
  constructor(x, y) {
    super(x, y, 16, 24);
    this.collisionOffsetX = 2;
    this.collisionOffsetY = 4;
    this.collisionWidth = 12;
    this.collisionHeight = 20;
    this.health = 1;
    this.speed = 0.5;
    this.shootTimer = 60 + Math.floor(Math.random() * 60);
    this.shootCooldown = 90;
    this.scoreValue = 100;
    this.activated = false;
    this.vy = 0;
    this.onGround = false;
    this.animFrame = 0;
    this.animTimer = 0;
    this.patrol = true;
    this.patrolDir = -1;
  }

  update(playerX, playerY, level) {
    if (!this.activated) return;

    // Gravity
    this.vy += GRAVITY;
    if (this.vy > 6) this.vy = 6;

    // Simple ground check
    const footY = this.y + this.height + this.vy;
    if (level.isSolid(this.centerX, footY)) {
      this.vy = 0;
      this.onGround = true;
      // Snap to tile
      const tileY = Math.floor(footY / TILE_SIZE) * TILE_SIZE;
      this.y = tileY - this.height;
    } else {
      this.y += this.vy;
      this.onGround = false;
    }

    // Face player
    if (playerX < this.x) this.facing = -1;
    else this.facing = 1;

    // Patrol
    if (this.onGround && this.patrol) {
      this.x += this.patrolDir * this.speed;
      // Check if about to walk off edge
      if (!level.isSolid(this.x + (this.patrolDir > 0 ? this.width : 0), this.bottom + 4)) {
        this.patrolDir *= -1;
      }
      // Check wall
      if (level.isSolid(this.x + (this.patrolDir > 0 ? this.width : 0), this.centerY)) {
        this.patrolDir *= -1;
      }
    }

    // Shooting
    this.shootTimer--;
    if (this.shootTimer <= 0) {
      this.shootTimer = this.shootCooldown;
      return this.shoot(playerX, playerY);
    }
    return null;
  }

  shoot(playerX, playerY) {
    const dx = playerX - this.centerX;
    const dy = playerY - this.centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return null;
    const bvx = (dx / dist) * ENEMY_BULLET_SPEED;
    const bvy = (dy / dist) * ENEMY_BULLET_SPEED;
    return new Bullet(this.centerX, this.centerY, bvx, bvy, true);
  }

  hit(damage = 1) {
    this.health -= damage;
    if (this.health <= 0) this.dead = true;
    return this.dead;
  }

  draw(renderer, camX, camY) {
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    const offsetY = this.height - ENEMY_SOLDIER.length;
    renderer.drawSprite(ENEMY_SOLDIER, sx, sy + offsetY, this.facing === -1);
  }
}

export class Sniper extends Entity {
  constructor(x, y) {
    super(x, y, 16, 16);
    this.health = 1;
    this.shootTimer = 40 + Math.floor(Math.random() * 40);
    this.shootCooldown = 70;
    this.scoreValue = 200;
    this.activated = false;
  }

  update(playerX, playerY, level) {
    if (!this.activated) return null;

    if (playerX < this.x) this.facing = -1;
    else this.facing = 1;

    this.shootTimer--;
    if (this.shootTimer <= 0) {
      this.shootTimer = this.shootCooldown;
      return this.shoot(playerX, playerY);
    }
    return null;
  }

  shoot(playerX, playerY) {
    const dx = playerX - this.centerX;
    const dy = playerY - this.centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return null;
    return new Bullet(
      this.centerX, this.centerY,
      (dx / dist) * ENEMY_BULLET_SPEED * 1.2,
      (dy / dist) * ENEMY_BULLET_SPEED * 1.2,
      true
    );
  }

  hit(damage = 1) {
    this.health -= damage;
    if (this.health <= 0) this.dead = true;
    return this.dead;
  }

  draw(renderer, camX, camY) {
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    const offsetY = this.height - ENEMY_SNIPER.length;
    renderer.drawSprite(ENEMY_SNIPER, sx, sy + offsetY, this.facing === -1);
  }
}

export class Turret extends Entity {
  constructor(x, y) {
    super(x, y, 16, 16);
    this.health = 3;
    this.shootTimer = 30;
    this.shootCooldown = 50;
    this.scoreValue = 500;
    this.activated = false;
    this.angle = 0;
  }

  update(playerX, playerY, level) {
    if (!this.activated) return null;

    // Aim at player
    this.angle = Math.atan2(playerY - this.centerY, playerX - this.centerX);
    if (playerX < this.x) this.facing = -1;
    else this.facing = 1;

    this.shootTimer--;
    if (this.shootTimer <= 0) {
      this.shootTimer = this.shootCooldown;
      const bvx = Math.cos(this.angle) * ENEMY_BULLET_SPEED;
      const bvy = Math.sin(this.angle) * ENEMY_BULLET_SPEED;
      return new Bullet(this.centerX, this.centerY, bvx, bvy, true);
    }
    return null;
  }

  hit(damage = 1) {
    this.health -= damage;
    if (this.health <= 0) this.dead = true;
    return this.dead;
  }

  draw(renderer, camX, camY) {
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    const offsetY = this.height - TURRET_SPRITE.length;
    renderer.drawSprite(TURRET_SPRITE, sx, sy + offsetY, false);
    // Draw barrel
    const bx = sx + 8 + Math.cos(this.angle) * 8;
    const by = sy + offsetY + 5 + Math.sin(this.angle) * 8;
    renderer.drawRect(bx, by, 4, 2, '#888888');
  }
}

export class Runner extends Entity {
  constructor(x, y) {
    super(x, y, 16, 24);
    this.collisionOffsetX = 2;
    this.collisionOffsetY = 4;
    this.collisionWidth = 12;
    this.collisionHeight = 20;
    this.health = 1;
    this.speed = 2;
    this.scoreValue = 100;
    this.activated = false;
    this.vy = 0;
  }

  update(playerX, playerY, level) {
    if (!this.activated) return null;

    // Gravity
    this.vy += GRAVITY;
    if (this.vy > 6) this.vy = 6;

    const footY = this.y + this.height + this.vy;
    if (level.isSolid(this.centerX, footY)) {
      this.vy = 0;
      const tileY = Math.floor(footY / TILE_SIZE) * TILE_SIZE;
      this.y = tileY - this.height;
    } else {
      this.y += this.vy;
    }

    // Run toward player
    if (playerX < this.x) {
      this.x -= this.speed;
      this.facing = -1;
    } else {
      this.x += this.speed;
      this.facing = 1;
    }

    // Fall off screen = die
    if (this.y > level.height + 32) this.dead = true;

    return null;
  }

  hit(damage = 1) {
    this.health -= damage;
    if (this.health <= 0) this.dead = true;
    return this.dead;
  }

  draw(renderer, camX, camY) {
    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    const offsetY = this.height - ENEMY_SOLDIER.length;
    // Simple runner sprite - red soldier
    renderer.drawSprite(ENEMY_SOLDIER, sx, sy + offsetY, this.facing === -1);
    // Tint: draw a semi-transparent red overlay
    renderer.drawRect(sx + 3, sy + offsetY + 5, 10, 14, 'rgba(255,0,0,0.3)');
  }
}
