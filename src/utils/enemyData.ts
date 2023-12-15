import aster1 from "../assets/png/aster1.png";
import aster2 from "../assets/png/aster2.png";
import aster3 from "../assets/png/aster3.png";
import aster4 from "../assets/png/aster4.png";
import aster5 from "../assets/png/aster5.png";
import aster6 from "../assets/png/aster6.png";
import explotion2 from "../assets/png/explotion2.png";
import thanos from "../assets/png/thanos.png";
import rocket from "../assets/png/rocket.png";
import galaxyFirst from "../assets/png/galaxyFirst.jpg";
import galaxySecond from "../assets/png/galaxySecond.jpg";

import shoot from "../assets/sounds/shoot.mp3";
import boom from "../assets/sounds/boom.mp3";
import levelOne from "../assets/sounds/levelOne.mp3";
import level2 from "../assets/sounds/2level.mp3";
import enemyShoot from "../assets/sounds/enemyShoot.mp3";
import lose from "../assets/sounds/lose.mp3";
import win from "../assets/sounds/win.mp3";
import swichLevel from "../assets/sounds/swichLevel.mp3";
import { EnemyId } from "../types/types";
import { BaseTexture, Rectangle, Texture } from "pixi.js";

export const asteroidsArray: EnemyId[] = [
  { id: 1, x: 500, y: 170, image: aster1 },
  { id: 2, x: 570, y: 80, image: aster2 },
  { id: 3, x: 470, y: 30, image: aster3 },
  { id: 4, x: 800, y: 90, image: aster4 },
  { id: 5, x: 670, y: 230, image: aster5 },
  { id: 6, x: 370, y: 120, image: aster6 },
];

export const bossData: EnemyId[] = [
  { id: 7, x: 650, y: 50, image: thanos, health: 4, maxHealth: 4 },
];

export const IMG = {
  rocket,
  galaxyFirst,
  galaxySecond,
};

export const mp3 = {
  levelOne,
  level2,
  shoot,
  enemyShoot,
  lose,
  win,
  boom,
  swichLevel,
};

const texture = BaseTexture.from(explotion2);

const frameRectangles = [
  new Rectangle(0, 194, 185, 185),
  new Rectangle(194, 0, 185, 185),
  new Rectangle(0, 0, 187, 187),
  new Rectangle(185, 185, 185, 185),
  new Rectangle(370, 0, 185, 185),
  new Rectangle(370, 185, 185, 185),
  new Rectangle(0, 370, 185, 185),
  new Rectangle(185, 370, 185, 185),
  new Rectangle(370, 370, 185, 185),
];

export const explosion = frameRectangles.map((rect) => new Texture(texture, rect));
