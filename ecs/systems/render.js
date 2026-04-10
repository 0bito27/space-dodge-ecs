// ecs/systems/render.js
import { getEntities, has } from "../world.js";

export const createRenderSystem = (canvas) => {
  const ctx2d = canvas.getContext("2d");


  const clear = (w, h) => {
    ctx2d.clearRect(0, 0, w, h);
  };


  const drawSprite = (img, x, y, w, h, angle = 0) => {
    ctx2d.save();
    ctx2d.translate(x, y);
    ctx2d.rotate(angle);
    ctx2d.drawImage(img, -w / 2, -h / 2, w, h);
    ctx2d.restore();
  };


  const drawHud = (world) => {
    ctx2d.fillStyle = "#c7d2fe";
    ctx2d.font = "16px system-ui";

    const t = world.game.time.toFixed(1);
    const lvl = world.game.level ?? 0;

    ctx2d.fillText(`Time: ${t}s`, 16, 26);
    ctx2d.fillText(`Level: ${lvl}`, 16, 48);

    if (world.game.bestLocal != null) {
      ctx2d.fillText(`Best (local): ${world.game.bestLocal.toFixed(1)}s`, 16, 70);
    }

    if (world.game.paused) {
        ctx2d.fillStyle = "#fde68a";
        ctx2d.fillText("PAUSED (P)", 16, 92);
    }

  };

  const drawGameOver = (world) => {
    const { width, height } = world.meta;

    // overlay
    ctx2d.fillStyle = "rgba(0,0,0,0.55)";
    ctx2d.fillRect(0, 0, width, height);

    ctx2d.fillStyle = "#fca5a5";
    ctx2d.font = "46px system-ui";
    ctx2d.fillText("GAME OVER", width / 2 - 150, height / 2 - 20);

    ctx2d.fillStyle = "#e5e7eb";
    ctx2d.font = "18px system-ui";
    ctx2d.fillText("Press R to restart", width / 2 - 80, height / 2 + 18);
  };

  return (world, ctx) => {
    const { width, height } = world.meta;

    // background
    if (ctx.images?.bg) {
      ctx2d.drawImage(ctx.images.bg, 0, 0, width, height);
    } else {
      clear(width, height);
    }

    // sprites
    const sprites = getEntities(world, has("Position", "Sprite"));
    sprites.forEach((e) => {
      const { Position, Sprite } = e.components;
      const angle = e.components.Rotation?.a ?? 0;
      const img = ctx.images?.[Sprite.key];
      if (!img) return;

      drawSprite(img, Position.x, Position.y, Sprite.w, Sprite.h, angle);
    });

    drawHud(world);

    if (world.game.over) drawGameOver(world);

    return world;
  };
};

