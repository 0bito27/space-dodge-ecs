// ecs/systems/movement.js
import { updateEntities, isTag, has } from "../world.js";
import { clamp } from "../utils.js";

export const createMovementSystem = () => {
  const PLAYER_SPEED = 260; // px/s

  const normalize = (x, y) => {
    const len = Math.hypot(x, y);
    if (len === 0) return { x: 0, y: 0 };
    return { x: x / len, y: y / len };
  };

  return (world, ctx) => {
    if (world.game.over) return world;
    if (world.game.paused) return world;


    const { dt } = ctx;
    const { width, height } = world.meta;
    const { moveX, moveY } = world.input;

    const dir = normalize(moveX, moveY);

    // velocity na osnovu input-a
    const withPlayerVelocity = updateEntities(
      world,
      (e) => isTag("Player")(e) && has("Velocity")(e),
      (e) => ({
        ...e,
        components: {
          ...e.components,
          Velocity: { x: dir.x * PLAYER_SPEED, y: dir.y * PLAYER_SPEED },
        },
      })
    );

    // pomeri sve entitete koji imaju Position + Velocity
    const moved = updateEntities(
        withPlayerVelocity,
        has("Position", "Velocity"),
        (e) => {
            const { Position, Velocity, Collider } = e.components;

            const nx = Position.x + Velocity.x * dt;
            const ny = Position.y + Velocity.y * dt;

            // clamp za igraca
            if (isTag("Player")(e)) {
            const r = Collider?.r ?? 0;
            return {
                ...e,
                components: {
                ...e.components,
                Position: {
                    x: clamp(r, width - r, nx),
                    y: clamp(r, height - r, ny),
                },
                },
            };
            }

            // prepreke bez clamp-a
            return {
            ...e,
            components: {
                ...e.components,
                Position: { x: nx, y: ny },
            },
            };
        }
    );


    return moved;
  };
};
