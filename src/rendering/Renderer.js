import { SCREEN_WIDTH, SCREEN_HEIGHT, SCALE } from '../utils/Constants.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Set internal resolution to NES size
    this.canvas.width = SCREEN_WIDTH;
    this.canvas.height = SCREEN_HEIGHT;

    // Scale canvas to fit screen
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Disable image smoothing for pixel art
    this.ctx.imageSmoothingEnabled = false;
  }

  resize() {
    const maxW = window.innerWidth;
    const maxH = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    // Integer scaling: snap to whole-number multiples of NES pixels
    // so each game pixel maps to exactly N×N screen pixels (no blur)
    const physicalW = maxW * dpr;
    const physicalH = maxH * dpr;
    const intScale = Math.max(1, Math.floor(Math.min(
      physicalW / SCREEN_WIDTH,
      physicalH / SCREEN_HEIGHT
    )));

    // Convert back to CSS pixels
    const cssW = (SCREEN_WIDTH * intScale) / dpr;
    const cssH = (SCREEN_HEIGHT * intScale) / dpr;

    this.canvas.style.width = cssW + 'px';
    this.canvas.style.height = cssH + 'px';
  }

  clear(color = '#000000') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  drawRect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }

  drawCircle(x, y, radius, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(Math.round(x), Math.round(y), radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawText(text, x, y, color = '#fcfcfc', size = 8, align = 'left') {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px monospace`;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(text, Math.round(x), Math.round(y));
  }

  drawSprite(spriteData, x, y, flipX = false) {
    const px = Math.round(x);
    const py = Math.round(y);

    this.ctx.save();
    if (flipX) {
      this.ctx.scale(-1, 1);
      this._drawPixelArt(spriteData, -px - spriteData[0].length, py);
    } else {
      this._drawPixelArt(spriteData, px, py);
    }
    this.ctx.restore();
  }

  _drawPixelArt(data, x, y) {
    for (let row = 0; row < data.length; row++) {
      for (let col = 0; col < data[row].length; col++) {
        const color = data[row][col];
        if (color) {
          this.ctx.fillStyle = color;
          this.ctx.fillRect(x + col, y + row, 1, 1);
        }
      }
    }
  }

  // Screen shake effect
  shake(intensity = 2) {
    const ox = (Math.random() - 0.5) * intensity * 2;
    const oy = (Math.random() - 0.5) * intensity * 2;
    this.ctx.setTransform(1, 0, 0, 1, Math.round(ox), Math.round(oy));
  }

  resetTransform() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
