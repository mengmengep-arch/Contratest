export class Input {
  constructor() {
    this.keys = {};
    this.touchKeys = {};
    this.prevState = {};
    this.isTouchDevice = false;

    window.addEventListener('keydown', (e) => {
      e.preventDefault();
      this.keys[e.code] = true;
    });
    window.addEventListener('keyup', (e) => {
      e.preventDefault();
      this.keys[e.code] = false;
    });

    this._initTouch();
  }

  _initTouch() {
    const controls = document.getElementById('touch-controls');
    if (!controls) return;

    const buttons = controls.querySelectorAll('.btn');

    const updateTouches = (e) => {
      e.preventDefault();
      this.isTouchDevice = true;
      // Clear all touch keys
      for (const key in this.touchKeys) this.touchKeys[key] = false;
      // Check which buttons are currently touched
      for (const touch of e.touches) {
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        if (el && el.dataset && el.dataset.key) {
          this.touchKeys[el.dataset.key] = true;
          el.classList.add('active');
        }
      }
      // Update visual state
      buttons.forEach(btn => {
        if (!this.touchKeys[btn.dataset.key]) btn.classList.remove('active');
      });
    };

    const endTouches = (e) => {
      e.preventDefault();
      // Re-check remaining touches
      for (const key in this.touchKeys) this.touchKeys[key] = false;
      for (const touch of e.touches) {
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        if (el && el.dataset && el.dataset.key) {
          this.touchKeys[el.dataset.key] = true;
        }
      }
      buttons.forEach(btn => {
        if (this.touchKeys[btn.dataset.key]) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    };

    controls.addEventListener('touchstart', updateTouches, { passive: false });
    controls.addEventListener('touchmove', updateTouches, { passive: false });
    controls.addEventListener('touchend', endTouches, { passive: false });
    controls.addEventListener('touchcancel', endTouches, { passive: false });

    // Prevent context menu on long press
    controls.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  // Combined state: keyboard OR touch
  _isActive(key) {
    return !!this.keys[key] || !!this.touchKeys[key];
  }

  update() {
    this.prevState = { ...this._currentState };
  }

  get _currentState() {
    const state = {};
    const allKeys = new Set([...Object.keys(this.keys), ...Object.keys(this.touchKeys)]);
    for (const key of allKeys) {
      state[key] = !!this.keys[key] || !!this.touchKeys[key];
    }
    return state;
  }

  isDown(key) { return this._isActive(key); }
  isPressed(key) { return this._isActive(key) && !this.prevState[key]; }
  isReleased(key) { return !this._isActive(key) && !!this.prevState[key]; }

  get left() { return this.isDown('ArrowLeft'); }
  get right() { return this.isDown('ArrowRight'); }
  get up() { return this.isDown('ArrowUp'); }
  get down() { return this.isDown('ArrowDown'); }
  get jump() { return this.isPressed('KeyX'); }
  get shoot() { return this.isDown('KeyZ'); }
  get shootPressed() { return this.isPressed('KeyZ'); }
  get start() { return this.isPressed('Enter'); }
}
