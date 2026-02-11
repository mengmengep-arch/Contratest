import { EXPLOSION_COLORS } from './Sprites.js';

class Particle {
  constructor(x, y, vx, vy, life, color, size) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
    this.color = color;
    this.size = size;
    this.dead = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.08; // gravity on particles
    this.life--;
    if (this.life <= 0) this.dead = true;
  }

  draw(renderer, camX, camY) {
    const alpha = this.life / this.maxLife;
    const colorIndex = Math.floor((1 - alpha) * (EXPLOSION_COLORS.length - 1));
    const color = this.color || EXPLOSION_COLORS[colorIndex];
    renderer.drawRect(
      Math.round(this.x - camX),
      Math.round(this.y - camY),
      this.size, this.size, color
    );
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(x, y, count = 10, spread = 3, life = 20, colors = null, size = 2) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * spread;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 1;
      const color = colors ? colors[Math.floor(Math.random() * colors.length)] : null;
      const pLife = life + Math.floor(Math.random() * 10);
      this.particles.push(new Particle(x, y, vx, vy, pLife, color, size));
    }
  }

  explosion(x, y) {
    this.emit(x, y, 15, 3, 25, EXPLOSION_COLORS, 2);
  }

  smallExplosion(x, y) {
    this.emit(x, y, 6, 2, 15, EXPLOSION_COLORS, 1);
  }

  bigExplosion(x, y) {
    this.emit(x, y, 30, 4, 35, EXPLOSION_COLORS, 3);
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].dead) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(renderer, camX, camY) {
    for (const p of this.particles) {
      p.draw(renderer, camX, camY);
    }
  }
}
