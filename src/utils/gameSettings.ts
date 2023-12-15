import { ColorMatrixFilter } from "pixi.js";

export const basicSettings = {
  positionSpaceX: -500,
  positionSpaceY: -200,
  widthCanvas: 1280,
  heightCanvas: 720,
  brightness: 0.5,
  stepMoveSpace: 2,
  stepMoveBullet: 10,
  limitScore: 6,
  levelTime: 60,
  timeoutBeforeLevel: 2500,
  timeoutBetweenShoot: 700,
  intervalShoot: 2000,
  intervalPosition: 2000,
  enemySize: { x: 80, y: 80 },
  bossSize: { x: 120, y: 120 },
};

export const shipSettings = {
  stepMoveShip: 10,
  widthShip: 60,
  heightShip: 100,
};

export const bulletSettings = {
  bulletEnemyX: 20,
  bulletEnemyY: 90,
  initialPosition: { x: 0, y: 0, width: 0 },
  bulletY: 650,
  bulletCount: 10,
};

export const messages = {
  win: "YOU WIN!",
  boss: "BOSS FIGHT!",
  start: "START",
  lose: "GAME OVER!",
  again: "PLAY AGAIN?",
  time: "Time",
  bullets: "Bullets",
  health: "Health",
  score: "Score",
};

export const Filter = new ColorMatrixFilter();
Filter.brightness(basicSettings.brightness, true);
