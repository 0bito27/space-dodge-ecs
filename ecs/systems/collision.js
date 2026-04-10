// ecs/systems/collision.js
import { getEntities, isTag, has } from "../world.js";

export const createCollisionSystem = () => {
  const circleHit = (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const r = a.r + b.r;
    return dx * dx + dy * dy <= r * r;
  };

  return (world, ctx) => {
    if (world.game.over) return world;
    if (world.game.paused) return world;


    const player = getEntities(
      world,
      (e) => isTag("Player")(e) && has("Position", "Collider")(e)
    )[0];

    if (!player) return world;

    const obstacles = getEntities(
      world,
      (e) => isTag("Obstacle")(e) && has("Position", "Collider")(e)
    );

    const hit = obstacles.some((o) =>
      circleHit(
        {
          x: player.components.Position.x,
          y: player.components.Position.y,
          r: player.components.Collider.r,
        },
        {
          x: o.components.Position.x,
          y: o.components.Position.y,
          r: o.components.Collider.r,
        }
      )
    );

    if (!hit) return world;

    // GAME OVER (immutably)
    return {
      ...world,
      game: { ...world.game, over: true },
    };
  };
};
