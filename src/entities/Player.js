import { Entity } from './Entity.js';
import { Weapon } from '../weapons/Weapon.js';
import {
  GRAVITY, PLAYER_SPEED, PLAYER_JUMP_FORCE, PLAYER_MAX_FALL,
  WEAPON, INVINCIBLE_FRAMES, TILE_SIZE, SCREEN_WIDTH, SCREEN_HEIGHT
} from '../utils/Constants.js';
import {
  PLAYER_IDLE, PLAYER_RUN, PLAYER_JUMP, PLAYER_PRONE
} from '../rendering/Sprites.js';

export class Player extends Entity {
  constructor(x, y) {
    super(x, y, 16, 24);
    this.collisionOffsetX = 3;
    this.collisionOffsetY = 4;
    this.collisionWidth = 10;
    this.collisionHeight = 20;

    this.weapon = new Weapon(WEAPON.RIFLE);
    this.onGround = false;
    this.prone = false;
    this.aimX = 1;
    this.aimY = 0;
    this.animFrame = 0;
    this.animTimer = 0;
    this.invincible = 0;
    this.respawnTimer = 0;
    this.alive = true;
    this.jumpHeld = false;
  }

  update(input, level) {
    if (!this.alive) {
      this.respawnTimer--;
      return;
    }

    if (this.invincible > 0) this.invincible--;
    this.weapon.update();

    // Determine aim direction
    this.aimX = this.facing;
    this.aimY = 0;
    if (input.up) this.aimY = -1;
    if (input.down && !this.onGround) this.aimY = 1;
    if (input.down && this.onGround) {
      this.prone = true;
      this.aimY = 0;
    } else {
      this.prone = false;
    }

    // Update collision box for prone
    if (this.prone) {
      this.collisionOffsetY = 14;
      this.collisionHeight = 10;
    } else {
      this.collisionOffsetY = 4;
      this.collisionHeight = 20;
    }

    // Horizontal movement
    if (!this.prone) {
      if (input.left) {
        this.vx = -PLAYER_SPEED;
        this.facing = -1;
        this.aimX = -1;
      } else if (input.right) {
        this.vx = PLAYER_SPEED;
        this.facing = 1;
        this.aimX = 1;
      } else {
        this.vx = 0;
      }
    } else {
      this.vx = 0;
    }

    // If aiming up and not moving, aim straight up
    if (input.up && !input.left && !input.right) {
      this.aimX = 0;
      this.aimY = -1;
    }
    // Diagonal aiming
    if (input.up && input.right) { this.aimX = 1; this.aimY = -1; }
    if (input.up && input.left) { this.aimX = -1; this.aimY = -1; }
    if (input.down && !this.onGround && input.right) { this.aimX = 1; this.aimY = 1; }
    if (input.down && !this.onGround && input.left) { this.aimX = -1; this.aimY = 1; }

    // Normalize diagonal aim
    if (this.aimX !== 0 && this.aimY !== 0) {
      const len = Math.sqrt(this.aimX * this.aimX + this.aimY * this.aimY);
      this.aimX /= len;
      this.aimY /= len;
    }

    // Jumping
    if (input.jump && this.onGround) {
      this.vy = PLAYER_JUMP_FORCE;
      this.onGround = false;
      this.jumpHeld = true;
    }
    // Variable jump height
    if (!input.isDown('KeyX') && this.vy < 0) {
      this.vy *= 0.8;
    }

    // Drop through platforms when pressing down + jump
    if (input.down && input.jump && this.onGround) {
      this.y += 2;
      this.onGround = false;
    }

    // Apply gravity
    this.vy += GRAVITY;
    if (this.vy > PLAYER_MAX_FALL) this.vy = PLAYER_MAX_FALL;

    // Move with collision
    this.moveWithCollision(level);

    // Animation
    this.animTimer++;
    if (this.animTimer >= 6) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 3;
    }

    // Keep player in camera bounds (don't go left of camera)
    if (this.x < 0) this.x = 0;

    // Fall death
    if (this.y > level.height + 32) {
      this.die();
    }
  }

  moveWithCollision(level) {
    // Horizontal
    const newX = this.x + this.vx;
    const box = {
      x: newX + this.collisionOffsetX,
      y: this.y + this.collisionOffsetY,
      width: this.collisionWidth,
      height: this.collisionHeight
    };

    let hBlocked = false;
    // Check horizontal collision
    const checkPoints = [
      { x: this.vx > 0 ? box.x + box.width : box.x, y: box.y + 2 },
      { x: this.vx > 0 ? box.x + box.width : box.x, y: box.y + box.height - 2 },
      { x: this.vx > 0 ? box.x + box.width : box.x, y: box.y + box.height / 2 },
    ];
    for (const p of checkPoints) {
      if (level.isSolid(p.x, p.y)) { hBlocked = true; break; }
    }
    if (!hBlocked) {
      this.x = newX;
    }

    // Vertical
    const newY = this.y + this.vy;
    const vBox = {
      x: this.x + this.collisionOffsetX,
      y: newY + this.collisionOffsetY,
      width: this.collisionWidth,
      height: this.collisionHeight
    };

    this.onGround = false;
    if (this.vy >= 0) {
      // Falling - check bottom
      const footPoints = [
        { x: vBox.x + 2, y: vBox.y + vBox.height },
        { x: vBox.x + vBox.width - 2, y: vBox.y + vBox.height },
        { x: vBox.x + vBox.width / 2, y: vBox.y + vBox.height },
      ];
      let landed = false;
      for (const p of footPoints) {
        if (level.isSolid(p.x, p.y)) { landed = true; break; }
      }
      if (landed) {
        // Snap to tile top
        const tileY = Math.floor((vBox.y + vBox.height) / TILE_SIZE) * TILE_SIZE;
        this.y = tileY - this.collisionOffsetY - this.collisionHeight;
        this.vy = 0;
        this.onGround = true;
      } else {
        this.y = newY;
      }
    } else {
      // Rising - check top
      const headPoints = [
        { x: vBox.x + 2, y: vBox.y },
        { x: vBox.x + vBox.width - 2, y: vBox.y },
      ];
      let hitCeiling = false;
      for (const p of headPoints) {
        if (level.isSolid(p.x, p.y)) { hitCeiling = true; break; }
      }
      if (hitCeiling) {
        this.vy = 0;
      } else {
        this.y = newY;
      }
    }
  }

  shoot() {
    const gunX = this.centerX + this.aimX * 8;
    // Align bullet spawn with the bottom-aligned sprite's torso
    const gunY = this.prone ? this.y + this.height - 3 : this.y + this.height - 7;
    return this.weapon.fire(gunX, gunY, this.aimX, this.aimY);
  }

  die() {
    if (this.invincible > 0) return false;
    this.alive = false;
    this.respawnTimer = 60;
    this.weapon = new Weapon(WEAPON.RIFLE); // lose weapon on death
    return true;
  }

  respawn(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.alive = true;
    this.invincible = INVINCIBLE_FRAMES;
    this.onGround = false;
  }

  draw(renderer, camX, camY) {
    if (!this.alive) return;
    // Blink when invincible
    if (this.invincible > 0 && Math.floor(this.invincible / 4) % 2 === 0) return;

    const sx = Math.round(this.x - camX);
    const sy = Math.round(this.y - camY);
    const flipX = this.facing === -1;

    let sprite;
    if (this.prone) {
      sprite = PLAYER_PRONE;
    } else if (!this.onGround) {
      sprite = PLAYER_JUMP;
    } else if (Math.abs(this.vx) > 0.1) {
      sprite = PLAYER_RUN[this.animFrame % PLAYER_RUN.length];
    } else {
      sprite = PLAYER_IDLE;
    }

    // Bottom-align sprite within entity bounds so feet touch the ground
    const spriteOffsetY = this.height - sprite.length;
    renderer.drawSprite(sprite, sx, sy + spriteOffsetY, flipX);

    // Draw gun barrel line to show aim direction
    if (!this.prone) {
      const gx = sx + 8 + this.aimX * 8;
      const gy = sy + spriteOffsetY + 7 + this.aimY * 6;
      renderer.drawRect(gx, gy, 3, 1, '#888888');
    }
  }
}
