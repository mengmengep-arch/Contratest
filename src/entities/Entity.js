export class Entity {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vx = 0;
    this.vy = 0;
    this.dead = false;
    this.facing = 1; // 1 = right, -1 = left

    // Collision box offsets (can be smaller than visual sprite)
    this.collisionOffsetX = 0;
    this.collisionOffsetY = 0;
    this.collisionWidth = width;
    this.collisionHeight = height;
  }

  get centerX() { return this.x + this.width / 2; }
  get centerY() { return this.y + this.height / 2; }
  get bottom() { return this.y + this.height; }
  get right() { return this.x + this.width; }

  getBox() {
    return {
      x: this.x + this.collisionOffsetX,
      y: this.y + this.collisionOffsetY,
      width: this.collisionWidth,
      height: this.collisionHeight
    };
  }

  update() {}
  draw() {}
}
