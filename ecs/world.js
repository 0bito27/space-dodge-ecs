// ecs/world.js
export const createWorld = ({ width, height }) => ({
  meta: {
    nextId: 1,
    width,
    height,
  },
  input: {
    // -1..1
    moveX: 0,
    moveY: 0,
  },
  game: {
    over: false,
    time: 0,   // seconds survived
    score: 0,  // can be same as time later
  },
  entities: [], // array of { id, components: { ... } }
});

//entity helpers (immutably)
export const spawnEntity = (world, components) => {
  const id = world.meta.nextId;
  const entity = { id, components: { ...components } };

  return {
    ...world,
    meta: { ...world.meta, nextId: id + 1 },
    entities: [...world.entities, entity],
  };
};

export const updateEntities = (world, predicate, updater) => ({
  ...world,
  entities: world.entities.map((e) => (predicate(e) ? updater(e) : e)),
});

export const removeEntities = (world, predicate) => ({
  ...world,
  entities: world.entities.filter((e) => !predicate(e)),
});

// component queries
export const has = (...keys) => (e) =>
  keys.every((k) => Object.prototype.hasOwnProperty.call(e.components, k));

export const isTag = (tagName) => (e) =>
  Object.prototype.hasOwnProperty.call(e.components, tagName);

export const getEntities = (world, predicate) => world.entities.filter(predicate);
