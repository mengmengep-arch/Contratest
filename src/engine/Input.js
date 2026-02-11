export class Input {
  constructor() {
    this.keys = {};
    this.prevKeys = {};

    window.addEventListener('keydown', (e) => {
      e.preventDefault();
      this.keys[e.code] = true;
    });
    window.addEventListener('keyup', (e) => {
      e.preventDefault();
      this.keys[e.code] = false;
    });
  }

  update() {
    this.prevKeys = { ...this.keys };
  }

  isDown(key) { return !!this.keys[key]; }
  isPressed(key) { return !!this.keys[key] && !this.prevKeys[key]; }
  isReleased(key) { return !this.keys[key] && !!this.prevKeys[key]; }

  get left() { return this.isDown('ArrowLeft'); }
  get right() { return this.isDown('ArrowRight'); }
  get up() { return this.isDown('ArrowUp'); }
  get down() { return this.isDown('ArrowDown'); }
  get jump() { return this.isPressed('KeyX'); }
  get shoot() { return this.isDown('KeyZ'); }
  get shootPressed() { return this.isPressed('KeyZ'); }
  get start() { return this.isPressed('Enter'); }
}
