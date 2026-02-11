# Contra Classic Game Recreation - Implementation Plan

## Overview
Recreate the classic Contra (1987 NES) side-scrolling run-and-gun shooter as a browser-based game using HTML5 Canvas and vanilla JavaScript. The game will feature the iconic gameplay: 2D side-scrolling action, shooting in 8 directions, platforming, enemy waves, power-ups, and boss fights.

## Technology Stack
- **Rendering:** HTML5 Canvas 2D
- **Language:** Vanilla JavaScript (ES6+)
- **Build Tool:** Vite (fast dev server + bundling)
- **Assets:** Pixel art sprites (created programmatically or as sprite sheets)
- **Audio:** Web Audio API for retro sound effects and music
- **No external game frameworks** - built from scratch for authenticity

## Game Features (Classic Contra)

### Core Mechanics
1. Side-scrolling 2D platformer with run-and-gun gameplay
2. Player can run, jump, go prone (lie down), and shoot
3. 8-directional aiming (up, down, left, right, and 4 diagonals)
4. One-hit death (classic mode)
5. Lives system (start with 3 lives)
6. Score tracking

### Weapons / Power-ups (Flying capsules)
1. **Default Rifle** - Single shot, normal speed
2. **S - Spread Gun** - Fires 5 bullets in a spread pattern
3. **M - Machine Gun** - Rapid fire straight shots
4. **L - Laser** - Powerful beam that pierces enemies
5. **R - Rapid Fire** - Increases fire rate of current weapon
6. **B - Barrier** - Temporary invincibility shield

### Enemies
1. **Foot Soldiers** - Basic ground troops, run and shoot
2. **Snipers** - Stationary enemies on platforms, aim at player
3. **Turrets** - Mounted guns that rotate and fire
4. **Runners** - Fast enemies that charge at the player
5. **Grenadiers** - Lob explosive projectiles in arcs
6. **Boss Enemies** - Large, multi-phase bosses at end of levels

### Levels
1. **Level 1: Jungle** - Classic side-scrolling jungle with bridges, waterfalls, and enemy encampments
2. **Level 2: Base** - Enemy fortress with turrets and soldiers
3. **Level 3: Waterfall** - Vertical climbing section with platforms and falling hazards

### Visual Style
- Retro pixel art aesthetic (NES-era 8-bit style)
- Parallax scrolling backgrounds (multiple layers)
- Sprite-based animations for characters and effects
- Explosion and muzzle flash particle effects
- Screen shake on explosions

### Audio
- Chiptune-style background music
- Retro sound effects (shooting, explosions, power-up collection, death)
- Generated programmatically using Web Audio API oscillators

## Architecture

```
src/
  index.html          # Entry point HTML
  main.js             # Game initialization and main loop
  engine/
    Game.js           # Main game class, loop, state management
    Input.js          # Keyboard/gamepad input handling
    Camera.js         # Camera follow and screen scrolling
    Collision.js      # AABB and pixel collision detection
    AssetLoader.js    # Sprite sheet and audio loading
  entities/
    Entity.js         # Base entity class
    Player.js         # Player character (Bill Rizer)
    Enemy.js          # Base enemy class
    Soldier.js        # Foot soldier enemy
    Sniper.js         # Stationary sniper enemy
    Turret.js         # Rotating turret enemy
    Runner.js         # Charging enemy
    Boss.js           # Boss enemy base class
    JungleBoss.js     # Level 1 boss
  weapons/
    Weapon.js         # Base weapon class
    Rifle.js          # Default weapon
    SpreadGun.js      # S power-up
    MachineGun.js     # M power-up
    Laser.js          # L power-up
    Bullet.js         # Projectile base class
  pickups/
    PowerUp.js        # Flying capsule / power-up item
  levels/
    Level.js          # Base level class, tile map loading
    LevelData.js      # Level layout data (tile maps)
    Jungle.js         # Level 1 configuration
    Base.js           # Level 2 configuration
    Waterfall.js      # Level 3 configuration
  rendering/
    Renderer.js       # Canvas rendering manager
    SpriteSheet.js    # Sprite sheet parser and animator
    Particles.js      # Particle effects system
    Background.js     # Parallax background layers
    HUD.js            # Score, lives, weapon display
  audio/
    AudioManager.js   # Sound effect and music manager
    SoundEffects.js   # Programmatic retro sound generation
    Music.js          # Chiptune music sequences
  utils/
    Vector2.js        # 2D vector math
    Timer.js          # Frame-independent timing
    Constants.js      # Game constants and configuration
```

## Implementation Phases

### Phase 1: Project Setup & Game Engine Core
- [x] Initialize project with Vite
- [ ] Create HTML canvas entry point
- [ ] Implement game loop (fixed timestep at 60fps)
- [ ] Input system (keyboard mapping for arrows, Z=shoot, X=jump)
- [ ] Basic canvas rendering system
- [ ] Vector2 math utility
- [ ] Constants and configuration

### Phase 2: Player Character
- [ ] Player sprite rendering (programmatic pixel art)
- [ ] Movement: run left/right, jump with gravity
- [ ] Prone position (duck/lie down)
- [ ] 8-directional aiming
- [ ] Shooting with default rifle
- [ ] Player animation states (idle, run, jump, prone, death)
- [ ] Death and respawn logic

### Phase 3: Level System
- [ ] Tile-based level map system
- [ ] Tile collision (ground, platforms, walls)
- [ ] Camera scrolling (follows player, auto-scroll sections)
- [ ] Parallax background rendering
- [ ] Level 1 (Jungle) tile map design

### Phase 4: Enemies
- [ ] Base enemy class with AI states
- [ ] Foot soldiers (patrol, detect, shoot)
- [ ] Snipers (stationary, aim at player)
- [ ] Turrets (rotate, fire patterns)
- [ ] Runners (charge toward player)
- [ ] Enemy spawning system (triggered by camera position)
- [ ] Enemy bullet patterns

### Phase 5: Weapons & Power-ups
- [ ] Weapon switching system
- [ ] Spread Gun implementation
- [ ] Machine Gun implementation
- [ ] Laser implementation
- [ ] Flying capsule (power-up carrier)
- [ ] Power-up drop and collection

### Phase 6: Boss Fights
- [ ] Boss base class with health bar and phases
- [ ] Level 1 boss (wall-mounted defense system)
- [ ] Boss attack patterns and weak points
- [ ] Victory sequence and level transition

### Phase 7: Audio & Polish
- [ ] Web Audio API sound effects (shoot, explosion, jump, death, power-up)
- [ ] Chiptune background music
- [ ] Particle effects (explosions, bullet impacts, water splashes)
- [ ] Screen shake effects
- [ ] HUD (score, lives, current weapon)
- [ ] Title screen and game over screen
- [ ] High score tracking (localStorage)

### Phase 8: Additional Levels & Refinement
- [ ] Level 2: Base (fortress assault)
- [ ] Level 3: Waterfall (vertical scrolling)
- [ ] Difficulty balancing
- [ ] Performance optimization

## Controls
| Key | Action |
|-----|--------|
| Arrow Left/Right | Move |
| Arrow Up | Aim up / Enter door |
| Arrow Down | Prone / Aim down |
| Z | Shoot |
| X | Jump |
| Enter | Start / Pause |

## Game Constants
- Canvas: 256x240 (NES resolution), scaled up to fit screen
- Player speed: 2 px/frame
- Jump force: -6 px/frame
- Gravity: 0.35 px/frame^2
- Bullet speed: 5 px/frame
- Tile size: 16x16 pixels
- Frame rate: 60 FPS (fixed timestep)
