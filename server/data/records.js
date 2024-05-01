import {checkCache, addToCache, removeFromCache, clearUserCache} from "./cache.js";
import { ObjectId } from "mongodb";

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

export {getRecords, getRecordById, getRecordsByIds, insertRecord }