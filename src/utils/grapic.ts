import { Graphics } from "pixi.js";

export const grapicDraw = {
  bullet: (g: Graphics, x: number, y: number) => {
    g.clear();
    g.beginFill(0xffffff);
    g.moveTo(x, y - 10);
    g.lineTo(x - 5, y + 10);
    g.lineTo(x + 5, y + 10);
    g.lineTo(x, y - 10);
    g.endFill();
  },

  bulletEnemy: (g: Graphics, x: number, y: number) => {
    g.clear();
    g.beginFill(0xff0000);
    g.drawPolygon([
      -14, -14, -8, -20, 0, -14, 8, -20, 14, -14, 12, 0, 10, 10, 0, 14, -10, 10, -12, 0,
    ]);
    g.endFill();
    g.lineStyle(3, 0x8b4513, 1);
    g.drawPolygon([
      -14, -14, -8, -20, 0, -14, 8, -20, 14, -14, 12, 0, 10, 10, 0, 14, -10, 10, -12, 0,
    ]);
    g.x = x;
    g.y = y;
  },

  healthBar: (g: Graphics, x: number, y: number, health?: number, maxHealth?: number) => {
    const healthBarWidth = 120;
    const healthBarHeight = 8;
    let healthBarX = x;
    const healthBarY = y - 20;
    const remainingHealth = health || 0;
    const maxHealthDraw = maxHealth || 0;

    g.clear();
    g.beginFill(0x808080);
    g.drawRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    g.endFill();
    g.beginFill(0x00ff00);
    let filledWidth = (healthBarWidth * remainingHealth) / maxHealthDraw;
    g.drawRect(healthBarX, healthBarY, filledWidth, healthBarHeight);
    g.endFill();
  },
};

export const handlersMouse = {
  handleMouseOver: () => (document.body.style.cursor = "pointer"),
  handleMouseOut: () => (document.body.style.cursor = "default"),
};
