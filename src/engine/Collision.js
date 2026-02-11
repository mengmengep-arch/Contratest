export class Collision {
  // Axis-Aligned Bounding Box collision
  static aabb(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  // Point inside rectangle
  static pointInRect(px, py, rect) {
    return (
      px >= rect.x &&
      px <= rect.x + rect.width &&
      py >= rect.y &&
      py <= rect.y + rect.height
    );
  }

  // Get collision box for entity
  static getBox(entity) {
    return {
      x: entity.x + (entity.collisionOffsetX || 0),
      y: entity.y + (entity.collisionOffsetY || 0),
      width: entity.collisionWidth || entity.width,
      height: entity.collisionHeight || entity.height
    };
  }

  // Check entity vs tilemap collision
  static checkTileCollision(entity, level, dx, dy) {
    const box = this.getBox(entity);
    const newX = box.x + dx;
    const newY = box.y + dy;

    // Check all four corners and mid points
    const points = [
      { x: newX + 1, y: newY + 1 },
      { x: newX + box.width - 2, y: newY + 1 },
      { x: newX + 1, y: newY + box.height - 1 },
      { x: newX + box.width - 2, y: newY + box.height - 1 },
      { x: newX + box.width / 2, y: newY + box.height - 1 },
    ];

    for (const p of points) {
      if (level.isSolid(p.x, p.y)) {
        return true;
      }
    }
    return false;
  }
}
