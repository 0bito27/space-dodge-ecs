// ecs/systems/spawn.js
import { spawnEntity, removeEntities, isTag, has } from "../world.js";

export const createSpawnSystem = () => {
    const BASE_INTERVAL = 0.85; // seconds
    const BASE_SPEED = 140;     // px/s
    const MIN_INTERVAL = 0.25;

    const rand = (min, max) => min + Math.random() * (max - min);

    // tajmer
    let acc = 0;

    return (world, ctx) => {
        if (world.game.over) return world;
        if (world.game.paused) return world;


    acc += ctx.dt;

    const interval = world.game.spawnInterval ?? BASE_INTERVAL;
    const speed = world.game.obstacleSpeed ?? BASE_SPEED;
    const isFast = Math.random() < 0.35;
    const vy = isFast ? speed * 1.35 : speed * 0.9;


    let w = world;

    while (acc >= interval) {
        acc -= interval;

        const r = rand(10, 22);
        const x = rand(r, w.meta.width - r);
        const y = -r;
        const meteorKey = "meteor";

        w = spawnEntity(w, {
            Obstacle: true,
            ObstacleType: isFast ? "fast" : "normal",
            Position: { x, y },
            Velocity: { x: 0, y: vy },
            Collider: { r },
            Sprite: { key: meteorKey, w: r * 3.2, h: r * 3.2 },
        });

    }

    // clean-up
    const cleaned = removeEntities(w, (e) => {
        if (!(isTag("Obstacle")(e) && has("Position", "Collider")(e))) return false;
        const { Position, Collider } = e.components;
        return Position.y - Collider.r > w.meta.height + 10;
    });

    return cleaned;
  };
};
