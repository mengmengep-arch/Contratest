import { SCREEN_WIDTH, COLORS, WEAPON } from '../utils/Constants.js';

export class HUD {
  draw(renderer, player, score, lives, hiScore) {
    // Score
    renderer.drawText('1UP', 8, 4, COLORS.RED, 8);
    renderer.drawText(String(score).padStart(7, '0'), 8, 14, COLORS.WHITE, 8);

    // Hi-score
    renderer.drawText('HI', SCREEN_WIDTH / 2 - 20, 4, COLORS.RED, 8);
    renderer.drawText(String(hiScore).padStart(7, '0'), SCREEN_WIDTH / 2 - 20, 14, COLORS.WHITE, 8);

    // Lives
    renderer.drawText('REST', SCREEN_WIDTH - 50, 4, COLORS.RED, 8);
    renderer.drawText(String(Math.max(0, lives - 1)), SCREEN_WIDTH - 14, 4, COLORS.WHITE, 8);

    // Current weapon
    if (player && player.weapon) {
      const weaponName = this.getWeaponLabel(player.weapon.type);
      if (weaponName) {
        renderer.drawText(weaponName, SCREEN_WIDTH - 50, 14, '#fc9838', 8);
      }
    }
  }

  getWeaponLabel(type) {
    switch (type) {
      case WEAPON.SPREAD: return 'S';
      case WEAPON.MACHINE: return 'M';
      case WEAPON.LASER: return 'L';
      default: return '';
    }
  }
}
