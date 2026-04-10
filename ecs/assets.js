// ecs/assets.js
export const loadImages = (map) => {
  const entries = Object.entries(map);

  const promises = entries.map(([key, src]) => {
    const img = new Image();
    img.src = src;
    return new Promise((resolve, reject) => {
      img.onload = () => resolve([key, img]);
      img.onerror = reject;
    });
  });

  return Promise.all(promises).then((pairs) => Object.fromEntries(pairs));
};
