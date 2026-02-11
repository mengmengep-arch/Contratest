import { SCREEN_WIDTH, SCREEN_HEIGHT, COLORS } from '../utils/Constants.js';

export class Background {
  constructor() {
    this.layers = [];
  }

  // Generate a parallax jungle background
  static createJungle() {
    const bg = new Background();

    // Layer 0: Sky gradient
    bg.layers.push({
      speed: 0,
      draw: (ctx) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_HEIGHT);
        gradient.addColorStop(0, '#1c0028');
        gradient.addColorStop(0.3, '#2c1048');
        gradient.addColorStop(0.6, '#5c3070');
        gradient.addColorStop(1, '#8c5098');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      }
    });

    // Layer 1: Distant mountains
    bg.layers.push({
      speed: 0.1,
      draw: (ctx, offsetX) => {
        ctx.fillStyle = '#2a1040';
        for (let x = -50; x < SCREEN_WIDTH + 100; x += 80) {
          const bx = x - (offsetX * 0.1) % 80;
          drawMountain(ctx, bx, 100, 60, 80);
        }
      }
    });

    // Layer 2: Mid mountains with trees
    bg.layers.push({
      speed: 0.2,
      draw: (ctx, offsetX) => {
        ctx.fillStyle = '#1a2810';
        for (let x = -30; x < SCREEN_WIDTH + 80; x += 50) {
          const bx = x - (offsetX * 0.2) % 50;
          drawMountain(ctx, bx, 120, 40, 50);
        }
        // Trees silhouette
        ctx.fillStyle = '#0a1808';
        for (let x = -20; x < SCREEN_WIDTH + 40; x += 25) {
          const bx = x - (offsetX * 0.2) % 25;
          drawTree(ctx, bx, 110, 15, 35);
        }
      }
    });

    // Layer 3: Near trees
    bg.layers.push({
      speed: 0.4,
      draw: (ctx, offsetX) => {
        ctx.fillStyle = '#0c2008';
        for (let x = -20; x < SCREEN_WIDTH + 40; x += 35) {
          const bx = x - (offsetX * 0.4) % 35;
          drawTree(ctx, bx, 130, 20, 50);
        }
      }
    });

    return bg;
  }

  draw(ctx, cameraX, cameraY) {
    for (const layer of this.layers) {
      layer.draw(ctx, cameraX, cameraY);
    }
  }
}

function drawMountain(ctx, x, baseY, width, height) {
  ctx.beginPath();
  ctx.moveTo(x, baseY + height);
  ctx.lineTo(x + width / 2, baseY);
  ctx.lineTo(x + width, baseY + height);
  ctx.closePath();
  ctx.fill();
}

function drawTree(ctx, x, baseY, width, height) {
  // Trunk
  ctx.fillRect(x + width / 2 - 2, baseY, 4, height * 0.4);
  // Canopy
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.lineTo(x + width / 2, baseY - height * 0.6);
  ctx.lineTo(x + width, baseY);
  ctx.closePath();
  ctx.fill();
}
