import { Bullets, EnemyId } from "../types/types";

export function isBulletEnemyClash(
  asteroids: EnemyId[],
  bulletX: number,
  bulletY: number,
  boss: boolean,
  bossX: number
) {
  for (let i = 0; i < asteroids.length; i++) {
    const { x, y, id } = asteroids[i];
    const enemyX = boss ? bossX : x;
    const enemySize = boss ? 120 : 80;

    if (
      bulletX > enemyX &&
      bulletX < enemyX + enemySize &&
      bulletY + 20 > y &&
      bulletY < y + enemySize
    ) {
      return id;
    }
  }
  return -1;
}

export function isBulletBulletClash(bottomObj: Bullets, topObj: Bullets) {
  return (
    bottomObj.x + bottomObj.width > topObj.x &&
    bottomObj.x < topObj.x + topObj.width &&
    bottomObj.y + bottomObj.width > topObj.y &&
    bottomObj.y < topObj.y + topObj.width
  );
}
