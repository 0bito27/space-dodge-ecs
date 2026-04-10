// ecs/systems/difficulty.js
export const createDifficultySystem = () => {
  return (world, ctx) => {
    if (world.game.over) return world;
    if (world.game.paused) return world;


    const time = world.game.time;

    // level raste na svakih 8s
    const level = Math.floor(time / 8);

    // parametri težine
    const spawnInterval = Math.max(0.25, 0.85 - level * 0.08);
    const obstacleSpeed = 140 + level * 18;
    

    return {
      ...world,
      game: {
        ...world.game,
        level,
        spawnInterval,
        obstacleSpeed,
      },
    };
  };
};
