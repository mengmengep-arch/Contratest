import { TILE, Level } from './Level.js';
import { Background } from '../rendering/Background.js';
import { WEAPON } from '../utils/Constants.js';

const _ = TILE.EMPTY;
const G = TILE.GROUND;
const P = TILE.PLATFORM;
const B = TILE.BRIDGE;
const W = TILE.WALL;
const T = TILE.WATER_TOP;
const A = TILE.WATER;
const M = TILE.METAL;
const X = TILE.BOSS_WALL;

// Level 1: Jungle (80 columns x 15 rows)
const JUNGLE_COLS = 120;
const JUNGLE_ROWS = 15;

// prettier-ignore
const jungleMap = [
//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39
  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,  // row 0
  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,  // row 1
  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,  // row 2
  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,  // row 3
  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,  // row 4
  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,  // row 5
  _,_,_,_,_,_,_,_,_,_,_,_,_,_,P,P,P,_,_,_,_,_,_,_,_,_,_,_,_,_,P,P,P,P,_,_,_,_,_,_,  // row 6
  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,  // row 7
  _,_,_,_,_,_,_,_,_,P,P,P,_,_,_,_,_,_,_,_,_,P,P,P,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,  // row 8
  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,  // row 9
  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,B,B,B,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,  // row 10
  _,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,T,T,_,_,_,_,_,_,_,_,_,_,_,  // row 11
  G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,_,_,_,G,G,G,G,G,G,A,A,G,G,G,G,G,G,G,G,G,G,G,  // row 12
  G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,_,_,_,G,G,G,G,G,G,A,A,G,G,G,G,G,G,G,G,G,G,G,  // row 13
  G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,A,A,A,G,G,G,G,G,G,A,A,G,G,G,G,G,G,G,G,G,G,G,  // row 14
  // Continue the level (cols 40-79)
  ...generateJungleSection2(),
  // Continue the level (cols 80-119) - boss area
  ...generateBossSection(),
];

function generateJungleSection2() {
  // Cols 40-79, rows 0-14
  const section = [];
  for (let row = 0; row < 15; row++) {
    for (let col = 40; col < 80; col++) {
      if (row === 12 && col >= 40 && col <= 79) {
        // Ground with gaps
        if ((col >= 50 && col <= 52) || (col >= 62 && col <= 63)) {
          section.push(_); // gap
        } else {
          section.push(G);
        }
      } else if (row === 13 || row === 14) {
        if ((col >= 50 && col <= 52) || (col >= 62 && col <= 63)) {
          section.push(row === 13 ? T : A);
        } else {
          section.push(G);
        }
      } else if (row === 8 && (col === 44 || col === 45 || col === 46)) {
        section.push(P);
      } else if (row === 6 && (col >= 55 && col <= 58)) {
        section.push(P);
      } else if (row === 9 && (col >= 65 && col <= 68)) {
        section.push(P);
      } else if (row === 7 && (col >= 72 && col <= 75)) {
        section.push(P);
      } else if (row === 10 && (col >= 42 && col <= 44)) {
        section.push(B);
      } else {
        section.push(_);
      }
    }
  }
  return section;
}

function generateBossSection() {
  // Cols 80-119, rows 0-14
  const section = [];
  for (let row = 0; row < 15; row++) {
    for (let col = 80; col < 120; col++) {
      if (row >= 12) {
        section.push(G);
      } else if (col >= 110 && col <= 119 && row >= 2 && row <= 11) {
        // Boss wall
        section.push(X);
      } else if (row === 8 && (col >= 85 && col <= 87)) {
        section.push(P);
      } else if (row === 6 && (col >= 92 && col <= 94)) {
        section.push(P);
      } else if (row === 9 && (col >= 98 && col <= 101)) {
        section.push(P);
      } else {
        section.push(_);
      }
    }
  }
  return section;
}

// Enemy spawn data for jungle level
const jungleSpawns = [
  // Early soldiers
  { type: 'soldier', x: 200, y: 168 },
  { type: 'soldier', x: 280, y: 168 },
  { type: 'soldier', x: 350, y: 168 },

  // Power-up capsule
  { type: 'capsule', x: 300, y: 60, weapon: WEAPON.SPREAD },

  // Snipers on platforms
  { type: 'sniper', x: 230, y: 112 },
  { type: 'sniper', x: 490, y: 72 },

  // Mid section enemies
  { type: 'soldier', x: 450, y: 168 },
  { type: 'soldier', x: 520, y: 168 },
  { type: 'runner', x: 560, y: 168 },
  { type: 'capsule', x: 550, y: 40, weapon: WEAPON.MACHINE },

  // Bridge area
  { type: 'soldier', x: 600, y: 168 },
  { type: 'turret', x: 650, y: 120 },

  // Section 2 enemies
  { type: 'soldier', x: 700, y: 168 },
  { type: 'soldier', x: 750, y: 168 },
  { type: 'sniper', x: 720, y: 108 },
  { type: 'runner', x: 800, y: 168 },
  { type: 'soldier', x: 850, y: 168 },
  { type: 'capsule', x: 830, y: 50, weapon: WEAPON.LASER },

  // Turret section
  { type: 'turret', x: 900, y: 100 },
  { type: 'soldier', x: 950, y: 168 },
  { type: 'soldier', x: 980, y: 168 },
  { type: 'runner', x: 1020, y: 168 },
  { type: 'runner', x: 1050, y: 168 },

  // Near boss
  { type: 'soldier', x: 1100, y: 168 },
  { type: 'soldier', x: 1150, y: 168 },
  { type: 'turret', x: 1200, y: 120 },
  { type: 'capsule', x: 1180, y: 50, weapon: WEAPON.SPREAD },

  // Pre-boss soldiers
  { type: 'soldier', x: 1300, y: 168 },
  { type: 'soldier', x: 1350, y: 168 },
  { type: 'runner', x: 1400, y: 168 },
  { type: 'soldier', x: 1450, y: 168 },

  // Boss
  { type: 'boss', x: 1800, y: 40, triggerX: 1650 },
];

export function createJungleLevel() {
  const bg = Background.createJungle();
  return new Level(jungleMap, JUNGLE_COLS, JUNGLE_ROWS, [...jungleSpawns], bg);
}
