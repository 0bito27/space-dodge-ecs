export const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((acc, fn) => fn(acc), x);

export const clamp = (min, max, v) => Math.max(min, Math.min(max, v));

export const nowMs = () => performance.now();
