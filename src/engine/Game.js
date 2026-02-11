import { Input } from './Input.js';
import { Camera } from './Camera.js';
import { Collision } from './Collision.js';
import { Renderer } from '../rendering/Renderer.js';
import { ParticleSystem } from '../rendering/Particles.js';
import { HUD } from '../rendering/HUD.js';
import { Player } from '../entities/Player.js';
import { AudioManager } from '../audio/AudioManager.js';
import { Weapon } from '../weapons/Weapon.js';
import { createJungleLevel } from '../levels/LevelData.js';
import {
  SCREEN_WIDTH, SCREEN_HEIGHT, FRAME_TIME, STARTING_LIVES,
  STATE, COLORS, WEAPON
} from '../utils/Constants.js';

export class Game {
  constructor(canvas) {
    this.renderer = new Renderer(canvas);
    this.input = new Input();
    this.camera = new Camera();
    this.particles = new ParticleSystem();
    this.hud = new HUD();
    this.audio = new AudioManager();

    this.state = STATE.TITLE;
    this.score = 0;
    this.hiScore = parseInt(localStorage.getItem('contra_hiscore')) || 0;
    this.lives = STARTING_LIVES;

    this.player = null;
    this.level = null;
    this.enemies = [];
    this.playerBullets = [];
    this.enemyBullets = [];
    this.powerUps = [];
    this.capsules = [];

    this.shakeTimer = 0;
    this.transitionTimer = 0;
    this.titleBlink = 0;

    // Timing
    this.lastTime = 0;
    this.accumulator = 0;

    this.startGame = this.startGame.bind(this);
  }

  init() {
    this.loop(0);
  }

  loop(timestamp) {
    const dt = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.accumulator += dt;

    // Fixed timestep updates
    while (this.accumulator >= FRAME_TIME) {
      this.update();
      this.input.update();
      this.accumulator -= FRAME_TIME;
    }

    this.draw();
    requestAnimationFrame((t) => this.loop(t));
  }

  update() {
    switch (this.state) {
      case STATE.TITLE:
        this.updateTitle();
        break;
      case STATE.PLAYING:
        this.updatePlaying();
        break;
      case STATE.GAME_OVER:
        this.updateGameOver();
        break;
      case STATE.LEVEL_COMPLETE:
        this.updateLevelComplete();
        break;
    }
  }

  updateTitle() {
    this.titleBlink++;
    if (this.input.start) {
      this.audio.init();
      this.startGame();
    }
  }

  startGame() {
    this.state = STATE.PLAYING;
    this.score = 0;
    this.lives = STARTING_LIVES;
    this.loadLevel();
    this.audio.startMusic();
  }

  loadLevel() {
    this.level = createJungleLevel();
    this.player = new Player(32, 160);
    this.camera.setBounds(this.level.width, this.level.height);
    this.enemies = [];
    this.playerBullets = [];
    this.enemyBullets = [];
    this.powerUps = [];
    this.capsules = [];
  }

  updatePlaying() {
    if (this.input.start) {
      this.state = STATE.PAUSED;
      return;
    }

    // Update player
    if (this.player.alive) {
      this.player.update(this.input, this.level);

      // Shooting
      if (this.input.shoot) {
        const bullets = this.player.shoot();
        if (bullets.length > 0) {
          this.playerBullets.push(...bullets);
          this.audio.playShoot();
        }
      }
    } else {
      this.player.respawnTimer--;
      if (this.player.respawnTimer <= 0) {
        if (this.lives > 0) {
          this.lives--;
          this.player.respawn(this.camera.x + 32, 32);
        } else {
          this.state = STATE.GAME_OVER;
          this.audio.stopMusic();
          this.audio.playDeath();
          if (this.score > this.hiScore) {
            this.hiScore = this.score;
            localStorage.setItem('contra_hiscore', this.hiScore);
          }
        }
      }
    }

    // Camera follows player
    if (this.player.alive) {
      this.camera.follow(this.player);
    }

    // Spawn enemies from level
    const newEntities = this.level.getSpawnsInRange(this.camera.x);
    for (const entity of newEntities) {
      if (entity.weaponType !== undefined) {
        this.capsules.push(entity);
      } else {
        this.enemies.push(entity);
      }
    }

    // Check boss trigger
    if (this.level.checkBossTrigger(this.player.x)) {
      this.audio.playBossWarning();
    }

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      const result = enemy.update(this.player.centerX, this.player.centerY, this.level);
      if (result instanceof Object && result.vx !== undefined) {
        // Enemy fired a bullet
        this.enemyBullets.push(result);
        this.audio.playEnemyShoot();
      }
      // Remove dead or far off-screen enemies
      if (enemy.dead || enemy.x < this.camera.x - 64 || enemy.y > this.level.height + 64) {
        this.enemies.splice(i, 1);
      }
    }

    // Update flying capsules
    for (let i = this.capsules.length - 1; i >= 0; i--) {
      this.capsules[i].update();
      if (this.capsules[i].dead) this.capsules.splice(i, 1);
    }

    // Update power-ups
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      this.powerUps[i].update();
      if (this.powerUps[i].dead) this.powerUps.splice(i, 1);
    }

    // Update boss
    if (this.level.boss) {
      const bossResult = this.level.boss.update(this.player.centerX, this.player.centerY);
      if (bossResult === 'dead') {
        this.level.complete = true;
        this.state = STATE.LEVEL_COMPLETE;
        this.audio.stopMusic();
        this.audio.playLevelComplete();
        this.score += this.level.boss.scoreValue;
        this.level.boss = null;
      } else if (bossResult === 'dying') {
        this.shakeTimer = 2;
      } else if (Array.isArray(bossResult)) {
        for (const bullet of bossResult) {
          this.enemyBullets.push(bullet);
        }
      }
    }

    // Update bullets
    this.updateBullets();

    // Check collisions
    this.checkCollisions();

    // Update particles
    this.particles.update();

    // Screen shake
    if (this.shakeTimer > 0) this.shakeTimer--;

    // Prevent player from going behind camera
    if (this.player.alive && this.player.x < this.camera.x) {
      this.player.x = this.camera.x;
    }
  }

  updateBullets() {
    // Player bullets
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      const b = this.playerBullets[i];
      b.update();
      // Off screen or dead
      if (b.dead || b.x < this.camera.x - 16 || b.x > this.camera.x + SCREEN_WIDTH + 16 ||
          b.y < this.camera.y - 16 || b.y > this.camera.y + SCREEN_HEIGHT + 16) {
        this.playerBullets.splice(i, 1);
        continue;
      }
      // Hit tilemap
      if (this.level.isSolid(b.x, b.y) && !b.pierce) {
        this.particles.smallExplosion(b.x, b.y);
        this.playerBullets.splice(i, 1);
      }
    }

    // Enemy bullets
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      const b = this.enemyBullets[i];
      b.update();
      if (b.dead || b.x < this.camera.x - 16 || b.x > this.camera.x + SCREEN_WIDTH + 16 ||
          b.y < this.camera.y - 16 || b.y > this.camera.y + SCREEN_HEIGHT + 16) {
        this.enemyBullets.splice(i, 1);
        continue;
      }
      if (this.level.isSolid(b.x, b.y)) {
        this.enemyBullets.splice(i, 1);
      }
    }
  }

  checkCollisions() {
    const playerBox = this.player.alive ? this.player.getBox() : null;

    // Player bullets vs enemies
    for (let bi = this.playerBullets.length - 1; bi >= 0; bi--) {
      const bullet = this.playerBullets[bi];

      // vs enemies
      for (let ei = this.enemies.length - 1; ei >= 0; ei--) {
        const enemy = this.enemies[ei];
        if (Collision.aabb(bullet, enemy.getBox())) {
          if (enemy.hit(bullet.damage)) {
            this.score += enemy.scoreValue;
            this.particles.explosion(enemy.centerX, enemy.centerY);
            this.audio.playExplosion();
            this.enemies.splice(ei, 1);
          } else {
            this.particles.smallExplosion(bullet.x, bullet.y);
          }
          if (!bullet.pierce) {
            this.playerBullets.splice(bi, 1);
            break;
          }
        }
      }

      // vs capsules
      for (let ci = this.capsules.length - 1; ci >= 0; ci--) {
        const cap = this.capsules[ci];
        if (Collision.aabb(bullet, cap.getBox())) {
          const powerUp = cap.hit();
          if (powerUp) {
            this.powerUps.push(powerUp);
            this.score += cap.scoreValue;
            this.particles.explosion(cap.centerX, cap.centerY);
            this.audio.playExplosion();
            this.capsules.splice(ci, 1);
          }
          if (!bullet.pierce) {
            this.playerBullets.splice(bi, 1);
            break;
          }
        }
      }

      // vs boss
      if (this.level.boss && !this.level.boss.dying && bi < this.playerBullets.length) {
        const b = this.playerBullets[bi];
        if (b && this.level.boss.hitWeakPoint(b.x, b.y, b.damage)) {
          this.particles.smallExplosion(b.x, b.y);
          if (!b.pierce) {
            this.playerBullets.splice(bi, 1);
          }
        }
      }
    }

    if (!playerBox || !this.player.alive) return;

    // Enemy bullets vs player
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      if (Collision.aabb(this.enemyBullets[i], playerBox)) {
        this.enemyBullets.splice(i, 1);
        if (this.player.die()) {
          this.particles.explosion(this.player.centerX, this.player.centerY);
          this.audio.playDeath();
          this.shakeTimer = 10;
        }
        break;
      }
    }

    // Enemies touching player
    for (const enemy of this.enemies) {
      if (Collision.aabb(enemy.getBox(), playerBox)) {
        if (this.player.die()) {
          this.particles.explosion(this.player.centerX, this.player.centerY);
          this.audio.playDeath();
          this.shakeTimer = 10;
        }
        break;
      }
    }

    // Power-ups vs player
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      if (Collision.aabb(this.powerUps[i], playerBox)) {
        const pu = this.powerUps[i];
        this.player.weapon = new Weapon(pu.type);
        this.score += pu.scoreValue;
        this.audio.playPowerUp();
        this.powerUps.splice(i, 1);
      }
    }
  }

  updateGameOver() {
    this.titleBlink++;
    if (this.input.start) {
      this.state = STATE.TITLE;
    }
  }

  updateLevelComplete() {
    this.transitionTimer++;
    if (this.transitionTimer > 180) {
      // For now, loop back to title
      this.state = STATE.TITLE;
      this.transitionTimer = 0;
      if (this.score > this.hiScore) {
        this.hiScore = this.score;
        localStorage.setItem('contra_hiscore', this.hiScore);
      }
    }
  }

  draw() {
    const ctx = this.renderer.ctx;

    switch (this.state) {
      case STATE.TITLE:
        this.drawTitle();
        break;
      case STATE.PLAYING:
      case STATE.PAUSED:
        this.drawGame();
        if (this.state === STATE.PAUSED) {
          this.drawPauseOverlay();
        }
        break;
      case STATE.GAME_OVER:
        this.drawGameOver();
        break;
      case STATE.LEVEL_COMPLETE:
        this.drawGame();
        this.drawLevelComplete();
        break;
    }
  }

  drawTitle() {
    const ctx = this.renderer.ctx;
    this.renderer.clear('#000000');

    // Starfield background
    for (let i = 0; i < 50; i++) {
      const sx = (i * 73 + this.titleBlink * 0.2) % SCREEN_WIDTH;
      const sy = (i * 37) % SCREEN_HEIGHT;
      this.renderer.drawRect(sx, sy, 1, 1, '#ffffff');
    }

    // Title
    this.renderer.drawText('CONTRA', SCREEN_WIDTH / 2, 50, COLORS.RED, 16, 'center');
    this.renderer.drawText('CLASSIC', SCREEN_WIDTH / 2, 70, '#fc9838', 8, 'center');

    // Controls
    this.renderer.drawText('CONTROLS:', SCREEN_WIDTH / 2, 110, COLORS.WHITE, 8, 'center');
    this.renderer.drawText('ARROWS - MOVE/AIM', SCREEN_WIDTH / 2, 125, '#aaaaaa', 7, 'center');
    this.renderer.drawText('Z - SHOOT', SCREEN_WIDTH / 2, 137, '#aaaaaa', 7, 'center');
    this.renderer.drawText('X - JUMP', SCREEN_WIDTH / 2, 149, '#aaaaaa', 7, 'center');

    // Blink "press start"
    if (Math.floor(this.titleBlink / 30) % 2 === 0) {
      this.renderer.drawText('PRESS ENTER TO START', SCREEN_WIDTH / 2, 185, COLORS.WHITE, 8, 'center');
    }

    // Credits
    this.renderer.drawText('KONAMI 1987', SCREEN_WIDTH / 2, 220, '#666666', 6, 'center');
  }

  drawGame() {
    const ctx = this.renderer.ctx;
    const camX = this.camera.x;
    const camY = this.camera.y;

    // Screen shake
    if (this.shakeTimer > 0) {
      this.renderer.shake(3);
    } else {
      this.renderer.resetTransform();
    }

    // Background
    this.level.background.draw(ctx, camX, camY);

    // Tiles
    this.level.drawTiles(this.renderer, camX, camY);

    // Power-ups
    for (const pu of this.powerUps) {
      pu.draw(this.renderer, camX, camY);
    }

    // Capsules
    for (const cap of this.capsules) {
      cap.draw(this.renderer, camX, camY);
    }

    // Enemies
    for (const enemy of this.enemies) {
      enemy.draw(this.renderer, camX, camY);
    }

    // Boss
    if (this.level.boss) {
      this.level.boss.draw(this.renderer, camX, camY, this.particles);
    }

    // Player
    this.player.draw(this.renderer, camX, camY);

    // Bullets
    for (const b of this.playerBullets) {
      b.draw(this.renderer, camX, camY);
    }
    for (const b of this.enemyBullets) {
      b.draw(this.renderer, camX, camY);
    }

    // Particles
    this.particles.draw(this.renderer, camX, camY);

    // HUD
    this.renderer.resetTransform();
    this.hud.draw(this.renderer, this.player, this.score, this.lives, this.hiScore);
  }

  drawPauseOverlay() {
    this.renderer.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 'rgba(0,0,0,0.5)');
    this.renderer.drawText('PAUSED', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 8, COLORS.WHITE, 12, 'center');
    this.renderer.drawText('PRESS ENTER', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 10, '#aaaaaa', 8, 'center');

    // Unpause
    if (this.input.start) {
      this.state = STATE.PLAYING;
    }
  }

  drawGameOver() {
    this.renderer.clear('#000000');
    this.renderer.drawText('GAME OVER', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 20, COLORS.RED, 14, 'center');
    this.renderer.drawText('SCORE: ' + String(this.score).padStart(7, '0'), SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 10, COLORS.WHITE, 8, 'center');

    if (Math.floor(this.titleBlink / 30) % 2 === 0) {
      this.renderer.drawText('PRESS ENTER', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 40, '#aaaaaa', 8, 'center');
    }
  }

  drawLevelComplete() {
    this.renderer.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 'rgba(0,0,0,0.3)');
    this.renderer.drawText('STAGE CLEAR!', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 20, '#fc9838', 14, 'center');
    this.renderer.drawText('SCORE: ' + String(this.score).padStart(7, '0'), SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 10, COLORS.WHITE, 8, 'center');
  }
}
