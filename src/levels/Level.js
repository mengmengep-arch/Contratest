import { TILE_SIZE, SCREEN_WIDTH, SCREEN_HEIGHT, COLORS, WEAPON } from '../utils/Constants.js';
import { Soldier, Sniper, Turret, Runner } from '../entities/Enemy.js';
import { Boss } from '../entities/Boss.js';
import { FlyingCapsule } from '../pickups/PowerUp.js';

// Tile types
export const TILE = {
  EMPTY: 0,
  GROUND: 1,
  PLATFORM: 2,    // can jump through from below
  BRIDGE: 3,
  WALL: 4,
  WATER_TOP: 5,
  WATER: 6,
  METAL: 7,
  BOSS_WALL: 8,
};

export class Level {
  constructor(tileMap, width, height, spawns, background) {
    this.tileMap = tileMap;
    this.cols = width;
    this.rows = height;
    this.width = width * TILE_SIZE;
    this.height = height * TILE_SIZE;
    this.spawns = spawns || [];
    this.background = background;
    this.boss = null;
    this.bossTriggered = false;
    this.complete = false;
  }

  getTile(col, row) {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return TILE.EMPTY;
    return this.tileMap[row * this.cols + col];
  }

  isSolid(px, py) {
    const col = Math.floor(px / TILE_SIZE);
    const row = Math.floor(py / TILE_SIZE);
    const tile = this.getTile(col, row);
    return tile === TILE.GROUND || tile === TILE.WALL || tile === TILE.METAL ||
           tile === TILE.BRIDGE || tile === TILE.PLATFORM || tile === TILE.BOSS_WALL;
  }

  isPlatform(px, py) {
    const col = Math.floor(px / TILE_SIZE);
    const row = Math.floor(py / TILE_SIZE);
    const tile = this.getTile(col, row);
    return tile === TILE.PLATFORM || tile === TILE.BRIDGE;
  }

  isWater(px, py) {
    const col = Math.floor(px / TILE_SIZE);
    const row = Math.floor(py / TILE_SIZE);
    const tile = this.getTile(col, row);
    return tile === TILE.WATER || tile === TILE.WATER_TOP;
  }

  getSpawnsInRange(camX) {
    const entities = [];
    const activateRange = camX + SCREEN_WIDTH + 32;

    for (let i = this.spawns.length - 1; i >= 0; i--) {
      const spawn = this.spawns[i];
      if (spawn.x <= activateRange) {
        const entity = this.createEntity(spawn);
        if (entity) {
          entity.activated = true;
          entities.push(entity);
        }
        this.spawns.splice(i, 1);
      }
    }
    return entities;
  }

  createEntity(spawn) {
    switch (spawn.type) {
      case 'soldier': return new Soldier(spawn.x, spawn.y);
      case 'sniper': return new Sniper(spawn.x, spawn.y);
      case 'turret': return new Turret(spawn.x, spawn.y);
      case 'runner': return new Runner(spawn.x, spawn.y);
      case 'capsule': return new FlyingCapsule(spawn.x, spawn.y, spawn.weapon || WEAPON.SPREAD);
      case 'boss':
        this.boss = new Boss(spawn.x, spawn.y);
        return null;
      default: return null;
    }
  }

  checkBossTrigger(playerX) {
    if (!this.bossTriggered) {
      for (const spawn of this.spawns) {
        if (spawn.type === 'boss' && playerX >= spawn.triggerX) {
          this.bossTriggered = true;
          this.boss = new Boss(spawn.x, spawn.y);
          this.spawns = this.spawns.filter(s => s.type !== 'boss');
          return true;
        }
      }
    }
    return false;
  }

  drawTiles(renderer, camX, camY) {
    const startCol = Math.max(0, Math.floor(camX / TILE_SIZE));
    const endCol = Math.min(this.cols, Math.ceil((camX + SCREEN_WIDTH) / TILE_SIZE) + 1);
    const startRow = Math.max(0, Math.floor(camY / TILE_SIZE));
    const endRow = Math.min(this.rows, Math.ceil((camY + SCREEN_HEIGHT) / TILE_SIZE) + 1);

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const tile = this.getTile(col, row);
        if (tile === TILE.EMPTY) continue;

        const x = col * TILE_SIZE - Math.round(camX);
        const y = row * TILE_SIZE - Math.round(camY);

        switch (tile) {
          case TILE.GROUND:
            renderer.drawRect(x, y, TILE_SIZE, TILE_SIZE, COLORS.BROWN);
            renderer.drawRect(x, y, TILE_SIZE, 3, COLORS.GREEN);
            // Texture dots
            if ((col + row) % 3 === 0) renderer.drawRect(x + 4, y + 6, 2, 2, COLORS.DARK_BROWN);
            if ((col + row) % 4 === 1) renderer.drawRect(x + 10, y + 10, 2, 2, COLORS.DARK_BROWN);
            break;

          case TILE.PLATFORM:
            renderer.drawRect(x, y, TILE_SIZE, 4, COLORS.BROWN);
            renderer.drawRect(x, y, TILE_SIZE, 2, '#a06020');
            break;

          case TILE.BRIDGE:
            renderer.drawRect(x, y, TILE_SIZE, 5, COLORS.BROWN);
            renderer.drawRect(x + 2, y + 1, TILE_SIZE - 4, 3, '#a06020');
            // Bridge railings
            if (col % 3 === 0) renderer.drawRect(x + 7, y - 4, 2, 4, COLORS.BROWN);
            break;

          case TILE.WALL:
            renderer.drawRect(x, y, TILE_SIZE, TILE_SIZE, COLORS.DARK_METAL);
            renderer.drawRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2, COLORS.METAL);
            // Brick pattern
            if (row % 2 === 0) {
              renderer.drawRect(x + 7, y, 2, TILE_SIZE, COLORS.DARK_METAL);
            } else {
              renderer.drawRect(x, y, 2, TILE_SIZE, COLORS.DARK_METAL);
              renderer.drawRect(x + 14, y, 2, TILE_SIZE, COLORS.DARK_METAL);
            }
            break;

          case TILE.METAL:
            renderer.drawRect(x, y, TILE_SIZE, TILE_SIZE, COLORS.DARK_METAL);
            renderer.drawRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2, '#606060');
            renderer.drawRect(x + 2, y + 2, 2, 2, '#888888');
            renderer.drawRect(x + 12, y + 12, 2, 2, '#888888');
            break;

          case TILE.WATER_TOP:
            renderer.drawRect(x, y, TILE_SIZE, TILE_SIZE, '#1c3c8c');
            // Animated water surface
            const waveOffset = Math.sin((col * 0.5) + Date.now() * 0.003) * 2;
            renderer.drawRect(x, y + 2 + waveOffset, TILE_SIZE, 3, COLORS.WATER);
            break;

          case TILE.WATER:
            renderer.drawRect(x, y, TILE_SIZE, TILE_SIZE, '#0c2868');
            break;

          case TILE.BOSS_WALL:
            renderer.drawRect(x, y, TILE_SIZE, TILE_SIZE, '#404040');
            renderer.drawRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2, '#585858');
            // Rivets
            renderer.drawRect(x + 2, y + 2, 3, 3, '#707070');
            renderer.drawRect(x + 11, y + 11, 3, 3, '#707070');
            break;
        }
      }
    }
  }
}
