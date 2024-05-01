import { GraphQLError } from "graphql";
import { v4 as uuid } from "uuid";
import redis from "redis";
import { ObjectId } from "mongodb";
//import moment from "moment";
import axios from "axios";
import { users as usersCollection } from "./config/mongoCollections.js";
import bcrypt from 'bcrypt';
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

const clearUserCache = async  (_id) => {
  const keys = await client.lRange(_id, 0, -1);
  for (const key of keys) {
    await removeFromCache(key);
  }
  await removeFromCache(_id);
}
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
let charIsLowercase = function (c) {
  return c >= "a" && c <= "z";
}
let charIsNumber = function (c) {
  return c >= "0" && c <= "9";
}
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
let isValidEmail = function (email) {
  // Based on https://help.xmatters.com/ondemand/trial/valid_email_format.htm
  if (!email.includes("@")) return false;
  let s = email.split("@");
  if (s.length != 2) return false;
  let [prefix, domain] = s;
  if (!prefix.length || !domain.length) return false;

  for (let i = 0; i < prefix.length; i++) {
      if (
          charIsLowercase(prefix[i])
          ||
          charIsNumber(prefix[i])
      ) {
          continue;
      } else if ("_.-".includes(prefix[i])) {
          if (!i) return false;
          if (i == prefix.length - 1) return false;
          if ("_.-".includes(prefix[i - 1])) return false;
          continue;
      } else {
          return false;
      }
  }

  let idx = -1;
  for (let i = domain.length - 1; i >= 0; i--) {
      if (domain[i] == ".") {
          idx = i;
          break;
      }
  }
  if (idx == -1 || idx == 0 || idx == domain.length - 1) return false;
  let tld = domain.substring(idx + 1);
  let site = domain.substring(0, idx - 1);
  for (let i = 0; i < site.length; i++) {
      if (!(
          charIsLowercase(site[i]) || charIsNumber(site[i]) || site[i] == "-"
      )) { return false }
  }
  if (tld.length < 2) return false;
  return true;
}
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
function validatePassword(password) {
  if (password.length < 8) {
    throw new GraphQLError('Password must be at least 8 characters long.');
  }
  if (!/[A-Z]/.test(password)) {
    throw new GraphQLError('Password must contain at least one uppercase letter.');
  }
  if (!/[0-9]/.test(password)) {
    throw new GraphQLError('Password must contain at least one number.');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new GraphQLError('Password must contain at least one special character.');
  }
}
function isValidId(id) {
  if (!id) throw new GraphQLError('No id given');
  if (typeof id !== 'string') throw new GraphQLError('Id is not a string');
  if (!ObjectId.isValid(id.trim())) throw new GraphQLError('Id is not valid');
}
function verifyTimeRange(time_range) {
  const validRanges = ['short_term', 'medium_term', 'long_term'];
  if (!validRanges.includes(time_range)) {
      throw new Error(`Expected one of ${validRanges.join(', ')}, but got ${time_range}.`);
  }
}
function verifyOffset(offset) {
  if (typeof offset !== 'number' || offset < 0) {
      throw new Error(`The offset must be a non-negative integer.`);
  }
}
function verifyLimit(limit) {
  const maxLimit = 50; 
  if (typeof limit !== 'number' || limit < 1 || limit > maxLimit) {
      throw new Error(`The limit must be a number between 1 and ${maxLimit}.`);
  }
}

const getAccessToken = async (_id) => {
  isValidId(_id)
  const cache = await checkCache(`access_token:${_id}`)
  if(cache){
    return cache;
  }
  const users = await usersCollection();
  const user = await users.findOne({ _id: new ObjectId(_id) });
  if(!user || !user.refresh_token){
    return null;
  }
  const refresh_token = user.refresh_token;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const params = new URLSearchParams({
    refresh_token: refresh_token,
    grant_type: 'refresh_token'
  });
  const options = {
    url: 'https://accounts.spotify.com/api/token',
    form: params,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    },
    json: true
  };
  const response = await axios.post(options.url, options.form.toString(), {headers: options.headers});
  if (response.status === 200) {
    await addToCache(`access_token:${_id}`, response.data.access_token, 3600);
    return response.data.access_token;
  }
}
const handleResponse = async (response,key,_id) =>{
  const cache = await checkCache(key)
  if(!response){
    if(!cache){
      throw new GraphQLError("Server did not properly cache the first query.");
    }
    return cache.data;
  }
  if(!cache){
    await addToCache(key,response);
    await client.rPush(_id,key)
    return response.data;
  }
  if(cache.etag !== response.etag){//Hopefully this works
    await addToCache(key,response);
  }
  return response.data;
}
const getAxiosCall = async (url, access_token, etag, params ) =>{
  //Use this for get calls to the api 
  try{
    let headers = {
      'Authorization': `Bearer ${access_token}`, 
      'Content-Type': 'application/json'
    };
    if (etag) {
      headers['If-None-Match'] = etag;
    }
    const response = await axios({
      method: 'get',
      url: url,
      headers: headers,
      params: params,
      validateStatus: function (status) {
        return (status >= 200 && status < 300) || status === 304; // Resolve the promise for 304 status
      }
    });
    if (response.status === 304) {
      console.log('Data is not modified. Using cached version.');
      return null; 
    }
    if (response.status === 200) {
      console.log('Data fetched successfully.')
      if(!response.headers.etag ){
        console.log('ETag was not provided.');
      }
      return {
        data: response.data,
        etag: response.headers.etag 
      };
    }else{
      throw new GraphQLError(response);
    }
  }catch(error){
    throw new GraphQLError(error);
  }
}
const get = async (_id, key, url, params = null) =>{
  isValidId(_id);
  const access_token = await getAccessToken(_id);
  if(!access_token){
    throw new GraphQLError("Not authorized");
  }
  const cache = await checkCache(key);
  let etag = null
  if(cache){
    etag = cache.etag;
  }
  const response = await getAxiosCall(url,access_token,etag,params);
  const handledResponse = await handleResponse(response, key, _id);
  return handledResponse;
} 
export const resolvers = {
  Query: {
    getSpotifyAuthUrl: () => {
      const state = uuid()
      const scope = 'user-read-private user-read-email user-top-read'; //This is important, change this if u want to use calls that need diff perms
      const clientId = process.env.SPOTIFY_CLIENT_ID;
      const redirectUri = process.env.REDIRECT_URI;
      const params = new URLSearchParams({
          response_type: 'code',
          client_id: clientId,
          scope: scope,
          redirect_uri: redirectUri,
          state: state
      });
      return `https://accounts.spotify.com/authorize?${params.toString()}`;
    },
    getUser: async (_, { _id}) => {
      try{
        isValidId(_id)
        const users = await usersCollection();
        const user = await users.findOne({ _id: new ObjectId(_id) });
        if (!user) {
          throw new GraphQLError('Could not find user');
        }
        return{
          _id: user._id.toString(),
          email: user.email
        }
      }catch(error){
        throw new GraphQLError(error);
      }
    },
    validateUser: async (_, { email, password}) => {
      try{
        validateArgsString([email,password]);
        validatePassword(password);
        isValidEmail(email);
        email = email.trim();
        password = password.trim();
        const users = await usersCollection();
        const user = await users.findOne({ email: email });
        if (!user) {
          throw new GraphQLError('Either password or email is invalid');
        }
        const compare = await bcrypt.compare(password, user.password);
        if (!compare) {
          throw new GraphQLError('Either password or email is invalid');
        }
        return{
          _id: user._id.toString(),
          email: user.email
        }
      }catch(error){
        throw new GraphQLError(error);
      }
      
    },
    getSpotifyProfile: async (_, { _id}) =>{
      try{
        const response = await get(_id,`getSpotifyProfile:${_id}`,'https://api.spotify.com/v1/me');
        return response;
      }catch(error){
        throw new GraphQLError(error);
      }
    },
    getTopArtists: async (_, { _id, time_range, limit, offset}) => {
      try{
        verifyLimit(limit);
        verifyOffset(offset);
        verifyTimeRange(time_range);
        const params = new URLSearchParams({
          limit: limit, 
          offset: offset,
          time_range: time_range 
        });
        const response = await get(_id,`getTopArtists:${_id}:${params.toString()}`,'https://api.spotify.com/v1/me/top/artists',params);
        return response;
      }catch(error){
        throw new GraphQLError(error);
      }

    },
    getTopTracks: async (_, { _id, time_range, limit, offset}) => {
      try{
        verifyLimit(limit);
        verifyOffset(offset);
        verifyTimeRange(time_range);
        const params = new URLSearchParams({
          limit: limit, 
          offset: offset,
          time_range: time_range 
        });
        const response = await get(_id,`getTopTracks:${_id}:${params.toString()}`,'https://api.spotify.com/v1/me/top/tracks',params);
        return response;
      }catch(error){
        throw new GraphQLError(error);
      }

    },
  },
  Mutation: {
    authorizeSpotify: async (_, { _id, code }) => {
      try {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        const redirectUri = process.env.REDIRECT_URI;
        const params = new URLSearchParams({
          code: code,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        });
        const options = {
          url: 'https://accounts.spotify.com/api/token',
          form: params,
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
          },
          json: true
        };
        isValidId(_id);
        const users = await usersCollection();
        const user = await users.findOne({ _id: new ObjectId(_id) });
        if (!user) {
          throw new GraphQLError('Could not find user');
        }
        const response = await axios.post(options.url, options.form.toString(), {
        headers: options.headers
        });
        if (response.status === 200) {
          await users.updateOne(
            { _id: new ObjectId(_id) },
            {
            $set: {
                refresh_token:  response.data.refresh_token,
            },
            }
          );
          await addToCache(`access_token:${_id}`, response.data.access_token, 3600);
          await client.rPush(_id,`access_token:${_id}`)
          return {
            _id: user._id,
            email: user.email
          };
        } else {
          throw new GraphQLError('Request completed but status not OK:', response.status);
        }
      } catch (error) {
        throw new GraphQLError(error);
      }
    },
    deauthorizeSpotify: async (_, { _id}) => {
      try{
        isValidId(_id);
        const users = await usersCollection();
        const user = await users.findOne({ _id: new ObjectId(_id) });
        if (!user) {
          throw new GraphQLError('Could not find user');
        }
        if(!user.refresh_token){
          throw new GraphQLError('User is already deauthorized');
        }
        await users.updateOne(
          { _id: new ObjectId(_id) },
          {
          $set: {
              refresh_token:  null
          },
          }
        );
        await clearUserCache(_id);
        return{
          _id: _id,
          email: user.email
        }
      }catch(error){
        throw new GraphQLError(error)
      }
    },
    createUser: async (_, { email, password }) => {
      try{
        validateArgsString([email,password]);
        validatePassword(password);
        isValidEmail(email);
        email = email.trim();
        password = password.trim();
        const users = await usersCollection();
        const user = await users.findOne({
          email: { $regex: new RegExp('^' + email + '$', 'i') },
        });
        if (user) {
          throw new GraphQLError('Email address already taken');
        }
        const saltRounds = 16;
        const hashPass = await bcrypt.hash(password, saltRounds);
        let newUser = {
          _id: new ObjectId(),
          email: email, 
          password: hashPass,
          refresh_token: null
        };
        let record = await insertRecord(usersCollection,`user:${newUser._id.toString()}`,newUser);//Could change the key late idc
        await client.rPush(newUser._id.toString(),`user:${newUser._id}`)
        return {
          _id: record.id,
          email: record.email,
        }
      }catch(error){
        throw new GraphQLError(error)
      }
      
    },
    deleteUser: async (_, { _id }) => {
      try{
        isValidId(_id);
        const users = await usersCollection();
        const user = await users.findOne({ _id: new ObjectId(_id) });
        if(!user){
          throw new GraphQLError("User does not exist");
        }
        const userRemove = await users.findOneAndDelete({ _id: new ObjectId(_id) }, { returnDocument: 'after' });
        if(!userRemove){
          throw new GraphQLError("Could not remove");
        }
        await clearUserCache(_id);
        return{
          _id: _id,
          email: user.email
        }

      }catch(error){
        throw new GraphQLError(error);
      }
    }
  },
  User: {
    authorized : async (parentValue) => {
      const users = await usersCollection();
      const user = await users.findOne({ _id: new ObjectId(parentValue._id) });
      if(!user){
        return null;
      }
      if(!user.refresh_token){
        return false;
      }
      return true;
    }
  }
};

