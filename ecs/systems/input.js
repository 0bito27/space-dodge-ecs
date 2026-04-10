// ecs/systems/input.js
export const createInputSystem = () => {
  const down = new Set();        // trenutno držani tasteri
  const justPressed = new Set(); // tasteri pritisnuti od poslednjeg frame-a (edge)

  const onKeyDown = (e) => {
    // spreči scroll na strelicama/space
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
      e.preventDefault();
    }

    // key repeat ignore za "justPressed"
    if (!e.repeat) justPressed.add(e.code);
    down.add(e.code);
  };

  const onKeyUp = (e) => {
    down.delete(e.code);
  };

  window.addEventListener("keydown", onKeyDown, { passive: false });
  window.addEventListener("keyup", onKeyUp);

  const axis = () => {
    const left = down.has("ArrowLeft") || down.has("KeyA");
    const right = down.has("ArrowRight") || down.has("KeyD");
    const up = down.has("ArrowUp") || down.has("KeyW");
    const downK = down.has("ArrowDown") || down.has("KeyS");

    const moveX = (right ? 1 : 0) + (left ? -1 : 0);
    const moveY = (downK ? 1 : 0) + (up ? -1 : 0);

    return { moveX, moveY };
  };

  const consumePressed = (code) => {
    const v = justPressed.has(code);
    if (v) justPressed.delete(code);
    return v;
  };

  return (world, ctx) => {
    const { moveX, moveY } = axis();

    const restartPressed = consumePressed("KeyR");
    const pausePressed = consumePressed("KeyP");

    // restart (samo kad je game over)
    if (world.game.over && restartPressed) {
      const bestLocal = Math.max(world.game.bestLocal ?? 0, world.game.time);

      const resetPlayer = (e) => {
        if (!e.components.Player) return e;
        return {
          ...e,
          components: {
            ...e.components,
            Position: { x: world.meta.width / 2, y: world.meta.height / 2 },
            Velocity: { x: 0, y: 0 },
          },
        };
      };

      return {
        ...world,
        game: {
          over: false,
          time: 0,
          score: 0,
          level: 0,
          spawnInterval: 0.85,
          obstacleSpeed: 140,
          bestLocal,
          paused: false,
        },
        input: { ...world.input, moveX: 0, moveY: 0 },
        entities: world.entities
          .filter((e) => e.components.Player)
          .map(resetPlayer),
      };
    }

    // toggle pause
    const game2 = pausePressed && !world.game.over
      ? { ...world.game, paused: !world.game.paused }
      : world.game;

    return {
      ...world,
      game: game2,
      input: { ...world.input, moveX, moveY },
    };
  };
};
