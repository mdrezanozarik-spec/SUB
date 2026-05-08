
const cache = new Map();

export function getCache(key) {
  const v = cache.get(key);
  if (!v) return null;
  if (Date.now() > v.exp) {
    cache.delete(key);
    return null;
  }
  return v.data;
}

export function setCache(key, data, ttl = 60000) {
  cache.set(key, {
    data,
    exp: Date.now() + ttl
  });
}
