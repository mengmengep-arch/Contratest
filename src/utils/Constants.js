// NES resolution
export const SCREEN_WIDTH = 256;
export const SCREEN_HEIGHT = 240;
export const SCALE = 3;

// Physics
export const GRAVITY = 0.35;
export const PLAYER_SPEED = 1.5;
export const PLAYER_JUMP_FORCE = -5.5;
export const PLAYER_MAX_FALL = 6;
export const BULLET_SPEED = 5;
export const ENEMY_BULLET_SPEED = 2.5;

// Tiles
export const TILE_SIZE = 16;

// Game
export const FPS = 60;
export const FRAME_TIME = 1000 / FPS;
export const STARTING_LIVES = 3;
export const INVINCIBLE_FRAMES = 120;
export const RESPAWN_DELAY = 60;

// Directions (8-way)
export const DIR = {
  NONE: -1,
  RIGHT: 0,
  UP_RIGHT: 1,
  UP: 2,
  UP_LEFT: 3,
  LEFT: 4,
  DOWN_LEFT: 5,
  DOWN: 6,
  DOWN_RIGHT: 7
};

// Weapon types
export const WEAPON = {
  RIFLE: 'rifle',
  SPREAD: 'spread',
  MACHINE: 'machine',
  LASER: 'laser'
};

// Colors (NES palette inspired)
export const COLORS = {
  SKY: '#5c94fc',
  GROUND: '#8b4513',
  GRASS: '#00a800',
  PLAYER: '#fc9838',
  PLAYER_PANTS: '#0058f8',
  ENEMY: '#b8b8b8',
  ENEMY_RED: '#d82800',
  BULLET: '#fcfcfc',
  BULLET_ENEMY: '#fc4468',
  EXPLOSION: '#fc9838',
  HUD: '#fcfcfc',
  BLACK: '#000000',
  WHITE: '#fcfcfc',
  RED: '#d82800',
  GREEN: '#00a800',
  BLUE: '#0058f8',
  WATER: '#3cbcfc',
  DARK_GREEN: '#005800',
  BROWN: '#8b4513',
  DARK_BROWN: '#6a3208',
  METAL: '#747474',
  DARK_METAL: '#4a4a4a',
};

// Game states
export const STATE = {
  TITLE: 'title',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
  LEVEL_COMPLETE: 'level_complete',
  TRANSITION: 'transition'
};
