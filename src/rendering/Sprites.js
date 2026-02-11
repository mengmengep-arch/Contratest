import { COLORS } from '../utils/Constants.js';

const _ = null; // transparent
const W = COLORS.WHITE;
const K = COLORS.BLACK;
const S = COLORS.PLAYER;     // skin
const B = COLORS.BLUE;       // pants/shirt
const R = COLORS.RED;
const G = COLORS.GREEN;
const D = COLORS.DARK_GREEN;
const BR = COLORS.BROWN;
const DB = COLORS.DARK_BROWN;
const M = COLORS.METAL;
const DM = COLORS.DARK_METAL;
const ER = COLORS.ENEMY_RED;

// Player sprites (16x24 approx)
export const PLAYER_IDLE = [
  [_,_,_,_,_,S,S,S,S,_,_,_,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,_,_,_,_,_,_],
  [_,_,_,_,BR,BR,BR,S,S,_,_,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,_,_,_,_,_,_],
  [_,_,_,_,_,S,S,S,_,_,_,_,_,_,_,_],
  [_,_,_,_,B,B,B,B,B,_,_,_,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,_,_,_,_,_,_],
  [_,_,S,B,B,B,B,B,B,B,S,_,_,_,_,_],
  [_,_,S,_,B,B,B,B,B,_,S,_,_,_,_,_],
  [_,_,_,_,B,B,B,B,B,_,_,_,_,_,_,_],
  [_,_,_,_,B,B,_,B,B,_,_,_,_,_,_,_],
  [_,_,_,_,B,B,_,B,B,_,_,_,_,_,_,_],
  [_,_,_,BR,B,B,_,B,B,BR,_,_,_,_,_],
  [_,_,_,BR,BR,_,_,_,BR,BR,_,_,_,_],
];

export const PLAYER_RUN = [
  // Frame 1
  [
    [_,_,_,_,_,S,S,S,S,_,_,_,_,_,_,_],
    [_,_,_,_,S,S,S,S,S,S,_,_,_,_,_,_],
    [_,_,_,_,BR,BR,BR,S,S,_,_,_,_,_,_],
    [_,_,_,_,S,S,S,S,S,S,_,_,_,_,_,_],
    [_,_,_,_,_,S,S,S,_,_,_,_,_,_,_,_],
    [_,_,_,_,B,B,B,B,B,_,_,_,_,_,_,_],
    [_,_,_,B,B,B,B,B,B,B,_,_,_,_,_,_],
    [_,_,S,B,B,B,B,B,B,B,S,_,_,_,_,_],
    [_,_,S,_,B,B,B,B,B,_,S,_,_,_,_,_],
    [_,_,_,_,B,B,B,B,B,_,_,_,_,_,_,_],
    [_,_,_,_,B,B,_,B,B,_,_,_,_,_,_,_],
    [_,_,_,BR,B,_,_,_,B,BR,_,_,_,_,_],
    [_,_,BR,BR,_,_,_,_,_,BR,BR,_,_,_],
  ],
  // Frame 2
  [
    [_,_,_,_,_,S,S,S,S,_,_,_,_,_,_,_],
    [_,_,_,_,S,S,S,S,S,S,_,_,_,_,_,_],
    [_,_,_,_,BR,BR,BR,S,S,_,_,_,_,_,_],
    [_,_,_,_,S,S,S,S,S,S,_,_,_,_,_,_],
    [_,_,_,_,_,S,S,S,_,_,_,_,_,_,_,_],
    [_,_,_,_,B,B,B,B,B,_,_,_,_,_,_,_],
    [_,_,_,B,B,B,B,B,B,B,_,_,_,_,_,_],
    [_,_,S,B,B,B,B,B,B,B,S,_,_,_,_,_],
    [_,_,S,_,B,B,B,B,B,_,S,_,_,_,_,_],
    [_,_,_,_,B,B,B,B,B,_,_,_,_,_,_,_],
    [_,_,_,_,_,B,B,B,_,_,_,_,_,_,_,_],
    [_,_,_,_,B,B,_,B,B,_,_,_,_,_,_,_],
    [_,_,_,BR,BR,_,_,BR,BR,_,_,_,_,_],
  ],
  // Frame 3
  [
    [_,_,_,_,_,S,S,S,S,_,_,_,_,_,_,_],
    [_,_,_,_,S,S,S,S,S,S,_,_,_,_,_,_],
    [_,_,_,_,BR,BR,BR,S,S,_,_,_,_,_,_],
    [_,_,_,_,S,S,S,S,S,S,_,_,_,_,_,_],
    [_,_,_,_,_,S,S,S,_,_,_,_,_,_,_,_],
    [_,_,_,_,B,B,B,B,B,_,_,_,_,_,_,_],
    [_,_,_,B,B,B,B,B,B,B,_,_,_,_,_,_],
    [_,_,S,B,B,B,B,B,B,B,S,_,_,_,_,_],
    [_,_,S,_,B,B,B,B,B,_,S,_,_,_,_,_],
    [_,_,_,_,B,B,B,B,B,_,_,_,_,_,_,_],
    [_,_,_,_,B,_,_,_,B,_,_,_,_,_,_,_],
    [_,_,_,B,BR,_,_,_,BR,B,_,_,_,_,_],
    [_,_,BR,BR,_,_,_,_,_,BR,BR,_,_,_],
  ],
];

export const PLAYER_JUMP = [
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,S,S,S,S,_,_,_,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,_,_,_,_,_,_],
  [_,_,_,_,BR,BR,BR,S,S,_,_,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,S,_,_,_,_,_,_],
  [_,_,_,_,_,B,B,B,_,_,_,_,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,_,_,_,_,_,_],
  [_,_,S,B,B,B,B,B,B,S,_,_,_,_,_,_],
  [_,_,_,_,B,B,B,B,_,_,_,_,_,_,_,_],
  [_,_,_,BR,BR,B,B,BR,BR,_,_,_,_,_],
  [_,_,_,_,_,B,B,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,BR,BR,BR,BR,_,_,_,_,_,_],
];

export const PLAYER_PRONE = [
  [_,_,_,S,S,S,S,_,_,_,_,_,_,_,_,_],
  [_,_,S,S,S,S,S,S,_,_,_,_,_,_,_,_],
  [_,_,BR,BR,BR,S,S,_,_,_,_,_,_,_,_],
  [_,_,S,S,S,S,S,B,B,B,B,_,_,_,_,_],
  [_,_,_,B,B,B,B,B,B,B,B,B,_,_,_,_],
  [_,_,B,B,B,B,B,B,B,B,B,B,B,_,_,_],
  [_,BR,BR,_,_,_,_,_,_,_,BR,BR,_,_],
];

// Enemy soldier sprite
export const ENEMY_SOLDIER = [
  [_,_,_,_,DM,DM,DM,DM,_,_,_,_,_,_,_,_],
  [_,_,_,DM,DM,DM,DM,DM,DM,_,_,_,_,_,_],
  [_,_,_,DM,DM,DM,DM,DM,DM,_,_,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,_,_,_,_,_,_,_],
  [_,_,_,_,_,S,S,S,_,_,_,_,_,_,_,_],
  [_,_,_,_,ER,ER,ER,ER,ER,_,_,_,_,_,_],
  [_,_,_,ER,ER,ER,ER,ER,ER,ER,_,_,_,_],
  [_,_,S,ER,ER,ER,ER,ER,ER,ER,S,_,_,_],
  [_,_,S,_,ER,ER,ER,ER,ER,_,S,_,_,_,_],
  [_,_,_,_,ER,ER,ER,ER,ER,_,_,_,_,_,_],
  [_,_,_,_,ER,ER,_,ER,ER,_,_,_,_,_,_],
  [_,_,_,_,ER,ER,_,ER,ER,_,_,_,_,_,_],
  [_,_,_,DM,ER,ER,_,ER,ER,DM,_,_,_,_],
  [_,_,_,DM,DM,_,_,_,DM,DM,_,_,_,_],
];

// Sniper (crouching enemy)
export const ENEMY_SNIPER = [
  [_,_,_,_,DM,DM,DM,DM,_,_,_,_,_,_,_,_],
  [_,_,_,DM,DM,DM,DM,DM,DM,_,_,_,_,_,_],
  [_,_,_,_,S,S,S,S,S,_,_,_,_,_,_,_],
  [_,_,_,_,_,S,S,S,_,_,_,_,_,_,_,_],
  [_,_,_,ER,ER,ER,ER,ER,ER,_,_,_,_,_,_],
  [_,_,S,ER,ER,ER,ER,ER,ER,S,_,_,_,_,_],
  [_,_,_,ER,ER,ER,ER,ER,ER,_,_,_,_,_,_],
  [_,_,_,_,ER,ER,ER,ER,_,_,_,_,_,_,_,_],
  [_,_,_,DM,DM,_,_,DM,DM,_,_,_,_,_,_,_],
];

// Turret
export const TURRET_SPRITE = [
  [_,_,_,_,M,M,M,M,M,M,_,_,_,_,_,_],
  [_,_,_,M,M,DM,DM,DM,M,M,_,_,_,_,_],
  [_,_,M,M,DM,R,R,R,DM,M,M,_,_,_,_],
  [_,_,M,DM,R,R,K,R,R,DM,M,_,_,_,_],
  [_,_,M,M,DM,R,R,R,DM,M,M,_,_,_,_],
  [_,_,_,M,M,DM,DM,DM,M,M,_,_,_,_,_],
  [_,_,_,_,M,M,M,M,M,M,_,_,_,_,_,_],
  [_,_,M,M,M,M,M,M,M,M,M,M,_,_,_,_],
  [_,M,M,M,M,M,M,M,M,M,M,M,M,_,_,_],
  [_,M,M,M,M,M,M,M,M,M,M,M,M,_,_,_],
];

// Power-up capsule (flying)
export const POWERUP_CAPSULE = [
  [_,_,R,R,R,R,R,R,_,_],
  [_,R,R,W,W,W,W,R,R,_],
  [R,R,W,W,W,W,W,W,R,R],
  [R,R,W,W,W,W,W,W,R,R],
  [_,R,R,W,W,W,W,R,R,_],
  [_,_,R,R,R,R,R,R,_,_],
];

// Bullet sprite
export const BULLET_SPRITE = [
  [W,W],
  [W,W],
];

// Boss - wall mounted defense (32x32)
export const BOSS_CORE = [
  [_,_,_,_,_,_,M,M,M,M,M,M,M,M,M,M,M,M,M,M,_,_,_,_,_,_],
  [_,_,_,_,M,M,DM,DM,DM,DM,DM,DM,DM,DM,DM,DM,M,M,_,_,_,_],
  [_,_,_,M,DM,DM,DM,DM,DM,DM,DM,DM,DM,DM,DM,DM,DM,M,_,_,_],
  [_,_,M,DM,DM,_,_,DM,DM,DM,DM,DM,DM,_,_,DM,DM,DM,M,_,_],
  [_,M,DM,DM,_,R,R,_,DM,DM,DM,DM,_,R,R,_,DM,DM,DM,M,_,_],
  [_,M,DM,DM,_,R,R,_,DM,DM,DM,DM,_,R,R,_,DM,DM,DM,M,_,_],
  [_,_,M,DM,DM,_,_,DM,DM,DM,DM,DM,DM,_,_,DM,DM,DM,M,_,_],
  [_,_,_,M,DM,DM,DM,DM,R,R,R,R,DM,DM,DM,DM,DM,M,_,_,_,_],
  [_,_,_,_,M,DM,DM,R,R,R,R,R,R,DM,DM,DM,M,_,_,_,_,_],
  [_,_,_,_,_,M,M,R,R,R,R,R,R,M,M,M,_,_,_,_,_,_],
  [_,_,_,_,_,_,M,M,M,M,M,M,M,M,_,_,_,_,_,_,_,_],
];

// Explosion frames
export const EXPLOSION_COLORS = ['#fcfcfc', '#fc9838', '#d82800', '#880000'];
