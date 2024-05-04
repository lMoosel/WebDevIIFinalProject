import { ObjectId } from "mongodb";
import redis from "redis";

console.log(process.env);

const redisConnectionURL = process.env.REDIS_CONNECTION_URL || "redis://localhost:6379";

const client = redis.createClient({
  url: redisConnectionURL
});
await client.connect();

/**
 * Check if a value exists in the cache
 * @param {string} key - The key to check for
 * @returns {object} - The value if it exists, otherwise null
 */
const checkCache = async (key) => {
  const cache = await client.get(`${key}`);

  if (cache) {
    const data = await client.get(`${key}`);
    console.log(`getting ${key} from cache`);
    return JSON.parse(data);
  } else {
    return null;
  }
};

/**
 * Add a value to the cache
 * @param {string} key - The key to store the value under
 * @param {object} value - The value to store
 */
const addToCache = async (key, value, exp) => {
  // await removeFromCache(key);
  const data = JSON.stringify(value);

  if (exp === undefined) await client.set(`${key}`, data);
  else await client.set(`${key}`, data, {EX: exp});
};

const removeFromCache = async (key) => {
  console.log(`removing ${key} from cache`);
  await client.del(`${key}`);
};

const clearUserCache = async  (_id) => {
  const keys = await client.lRange(_id, 0, -1);
  for (const key of keys) {
    await removeFromCache(key);
  }
  await removeFromCache(_id);
}

export {client, checkCache, addToCache, removeFromCache, clearUserCache}