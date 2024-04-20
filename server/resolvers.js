import { GraphQLError } from "graphql";
import { v4 as uuid } from "uuid";
import redis from "redis";
import { ObjectId } from "mongodb";
import moment from "moment";
import { users as usersCollection } from "./config/mongoCollections.js";

const client = redis.createClient();
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
  else await client.set(`${key}`, data, "EX", exp);
};

const removeFromCache = async (key) => {
  console.log(`removing ${key} from cache`);
  await client.del(`${key}`);
};

const getRecords = async (collection, key) => {
  let records = await checkCache(key);

  if (!records) {
    const dataFn = await collection();
    records = await dataFn.find().toArray();

    if (!records) {
      // Could not find list
      throw new GraphQLError(`Internal server error`, {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    }

    records.forEach((record) => {
      record.id = record._id.toString();
    }),
      await addToCache(key, records, 60 * 60);
  }
  return records;
};

const getRecordById = async (collection, key, id, skipCache) => {
  let record;

  if (!skipCache) record = await checkCache(id);

  if (!record) {
    const dataFn = await collection();
    record = await dataFn.findOne({ _id: new ObjectId(id) });

    if (!record) {
      // Could not find record with given ID
      throw new GraphQLError(`${key} Not Found`, {
        extensions: { code: "NOT_FOUND" },
      });
    }

    record.id = record._id.toString();
    await addToCache(id, record);
  }

  return record;
};

const getRecordsByIds = async (collection, key, ids) => {
  let records = [];

  for (const id of ids) {
    records.push(await getRecordById(collection, key, id));
  }

  return records;
};

const insertRecord = async (collection, key, record) => {
  const dataFn = await collection();
  let response = await dataFn.insertOne(record);

  if (!response.acknowledged) {
    throw new GraphQLError(`Internal server error`, {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }

  const newRecord = await dataFn.findOne({ _id: response.insertedId });

  newRecord.id = newRecord._id.toString();

  await addToCache(key, newRecord);

  return newRecord;
};

const validateDate = (date, cmpDate = null) => {
  const formats = ["MM/DD/YYYY", "MM/D/YYYY", "M/DD/YYYY", "M/D/YYYY"];
  if (!moment(date, formats, true).isValid()) {
    throw new GraphQLError(`Invalid date`, {
      extensions: { code: "BAD_REQUEST" },
    });
  }

  if (!cmpDate) cmpDate = "01/01/1900";

  if (moment(date).isBefore(cmpDate) || moment(date).isAfter("12/31/2024")) {
    throw new GraphQLError(`Invalid date`, {
      extensions: { code: "BAD_REQUEST" },
    });
  }
};

const validateArgsString = (args) => {
  // Check for empty strings
  for (const key of Object.keys(args)) {
    if (typeof args[key] === "string") {
      // TODO - Updat the arg in args
      args[key] = args[key].trim();

      if (args[key].length < 1) {
        throw new GraphQLError(`Empty field`, {
          extensions: { code: "BAD_REQUEST" },
        });
      }
    } else if (Array.isArray(args[key])) {
      for (let item of args[key]) {
        if (typeof item === "string") {
          item = item.trim();

          if (item.length < 1) {
            throw new GraphQLError(`Empty field`, {
              extensions: { code: "BAD_REQUEST" },
            });
          }
        }
      }
    }
  }
};

export const resolvers = {
  Query: {},
  Mutation: {},
};
