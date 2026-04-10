// main.js
import { pipe, nowMs } from "./ecs/utils.js";
import { createWorld, spawnEntity } from "./ecs/world.js";
import { createInputSystem } from "./ecs/systems/input.js";
import { createRenderSystem } from "./ecs/systems/render.js";
import { createMovementSystem } from "./ecs/systems/movement.js";
import { createSpawnSystem } from "./ecs/systems/spawn.js";
import { createCollisionSystem } from "./ecs/systems/collision.js";
import { createDifficultySystem } from "./ecs/systems/difficulty.js";
import { loadImages } from "./ecs/assets.js";



const canvas = document.getElementById("game");

let images = null;

images = await loadImages({
  bg: "./assets/space.png",
  ship: "./assets/ufo.png",
  meteor: "./assets/meteor.png",
});


// init world
let world = createWorld({ width: canvas.width, height: canvas.height });

// resize helper (mora posle world)
const resizeCanvasToWindow = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  world = {
    ...world,
    meta: { ...world.meta, width: canvas.width, height: canvas.height },
  };
};

window.addEventListener("resize", resizeCanvasToWindow);
resizeCanvasToWindow();

// spawn player entity
world = spawnEntity(world, {
  Player: true,
  Position: { x: world.meta.width / 2, y: world.meta.height / 2 },
  Velocity: { x: 0, y: 0 },
  Collider: { r: 20 }, 
  Sprite: { key: "ship", w: 78, h: 78 },
});


// systems
const inputSystem = createInputSystem();
const renderSystem = createRenderSystem(canvas);
const movementSystem = createMovementSystem();
const spawnSystem = createSpawnSystem();
const collisionSystem = createCollisionSystem();
const difficultySystem = createDifficultySystem();



// “ctx” koji prosleđujemo sistemima
const makeCtx = (dt) => ({ dt, images });

// pipeline
const timeSystem = (world, ctx) => {
  if (world.game.over) return world;
  if (world.game.paused) return world;
  const t = world.game.time + ctx.dt;
  return { ...world, game: { ...world.game, time: t, score: t } };
};

// pipe radi nad (world) adapter da sistemi dobiju (world, ctx)
const runFrame = (world, ctx) =>
  pipe(
    (w) => inputSystem(w, ctx),
    (w) => movementSystem(w, ctx),
    (w) => timeSystem(w, ctx),
    (w) => difficultySystem(w, ctx),
    (w) => spawnSystem(w, ctx),
    (w) => collisionSystem(w, ctx),
    (w) => renderSystem(w, ctx)
  )(world);

let last = nowMs();
const loop = () => {
  const cur = nowMs();
  const dt = Math.min(0.05, (cur - last) / 1000); // clamp dt to avoid jumps
  last = cur;

  world = runFrame(world, makeCtx(dt));
  requestAnimationFrame(loop);
};

loop();
