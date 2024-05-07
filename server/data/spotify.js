import axios from "axios";
import { GraphQLError } from "graphql";
import { users as usersCollection } from "../config/mongoCollections.js";
import {
  client,
  checkCache,
  addToCache,
  removeFromCache,
  clearUserCache,
  push,
} from "./cache.js";
import { isValidId } from "../helpers.js";
import { ObjectId } from "mongodb";

export const getAccessToken = async (_id) => {
  isValidId(_id);
  const cache = await checkCache(`access_token:${_id}`);

  if (cache) {
    return cache;
  }

  const users = await usersCollection();
  const user = await users.findOne({ _id: new ObjectId(_id) });

  if (!user || !user.refresh_token) {
    return null;
  }

  const refresh_token = user.refresh_token;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const params = new URLSearchParams({
    refresh_token: refresh_token,
    grant_type: "refresh_token",
  });

  const options = {
    url: "https://accounts.spotify.com/api/token",
    form: params,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    json: true,
  };

  const response = await axios.post(options.url, options.form.toString(), {
    headers: options.headers,
  });

  if (response.status === 200) {
    await addToCache(`access_token:${_id}`, response.data.access_token, 3600);
    return response.data.access_token;
  }
};

export const handleResponse = async (response, key, _id, exp, hasParams) => {
  const cache = await checkCache(key);
  if (!response) {
    if (!cache) {
      throw new GraphQLError("Server did not properly cache the first query.");
    }
    return cache.data;
  }

  if (!cache) {
    if (hasParams) {
      await push(`spotify:${_id}`, key);
    }
    await addToCache(key, response, exp);
    return response.data;
  }

  if (cache.etag !== response.etag) {
    //Hopefully this works
    await addToCache(key, response, exp);
  }
  return response.data;
};

export const getAxiosCall = async (url, access_token, etag, params) => {
  //Use this for get calls to the api
  try {
    let headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };
    if (etag) {
      headers["If-None-Match"] = etag;
    }
    const response = await axios({
      method: "get",
      url: url,
      headers: headers,
      params: params,
      validateStatus: function (status) {
        return status === 200 || status === 304 || status === 204;
      },
    });
    if (response.status === 304) {
      //nothing changed
      console.log("Data is not modified. Using cached version.");
      return null;
    }
    if (response.status === 204) {
      //no response
      console.log("No response.");
      return {
        data: null,
        etag: null,
      };
    }
    if (response.status === 200) {
      console.log("Data fetched successfully.");
      if (!response.headers.etag) {
        console.log("ETag was not provided.");
      }
      return {
        data: response.data,
        etag: response.headers.etag,
      };
    } else {
      console.log(response);
      throw new GraphQLError(response.data);
    }
  } catch (error) {
    throw new GraphQLError(error);
  }
};

export const get = async (_id, key, exp, url, params = null) => {
  isValidId(_id);
  const cache = await checkCache(key);
  const access_token = await getAccessToken(_id);
  if (!access_token) {
    throw new GraphQLError("Not authorized");
  }
  let etag = null;
  if (cache) {
    //If we have stored it once and no etag
    etag = cache.etag;
    if (!etag) {
      return cache.data;
    }
  }
  const response = await getAxiosCall(url, access_token, etag, params);
  let hasParams = false;
  if (params) {
    hasParams = true;
  }

  const handledResponse = await handleResponse(
    response,
    key,
    _id,
    exp,
    hasParams,
  );
  return handledResponse;
};

export const getFavoriteArtists = async (_id, time_range, limit = 10) => {
  const url = "https://api.spotify.com/v1/me/top/artists";
  const params = {
    time_range,
    limit,
  };

  const data = await get(
    _id,
    `getFavoriteArtists:${_id + limit}`,
    60 * 60,
    url,
    params,
  );

  return data;
};

export const getFavoriteTracks = async (_id, time_range, limit = 10) => {
  const url = "https://api.spotify.com/v1/me/top/tracks";
  const params = {
    time_range,
    limit,
  };

  const data = await get(
    _id,
    `getFavoriteTracks:${_id + limit}`,
    60 * 60,
    url,
    params,
  );

  return data;
};

export const getFavoriteAlbums = async (_id, time_range, limit = 10) => {
  // Use top 50 tracks to decide favorite
  const data = await getFavoriteTracks(_id, time_range, 50);
  let albums = data.items.map((song) => song.album);

  let counts = {};
  for (const album of albums) {
    counts[album.name] = counts[album.name] ? counts[album.name] + 1 : 1;
  }

  // Sort descending
  let top = albums.sort((a, b) => counts[b.name] - counts[a.name]);
  top = top.filter(
    (v, i, a) =>
      counts[v.name] > 1 && a.findIndex((v2) => v2.name === v.name) === i,
  );

  return top.slice(0, limit);
};

export const getFavoriteGenres = async (_id, time_range, limit = 10) => {
  // Use 50 tracks to decide favorite
  const data = await getFavoriteArtists(_id, time_range, 50);

  // Can only get genre from artist
  const genres = data.items.map((artist) => artist.genres).flat();
  
  const counts = {};
  // Counts frequenct of genre
  for (const genre of genres) {
    counts[genre] = counts[genre] ? counts[genre] + 1 : 1;
  }

  // Sort descending
  let top = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  top = top.filter((genre) => counts[genre] >= 1);

  return top.slice(0, limit);
};

export const getRecentTracks = async (_id, limit = 20) => {
  const url = "https://api.spotify.com/v1/me/player/recently-played";
  const params = {
    limit,
  };

  const data = await get(
    _id,
    `getRecentTracks:${_id + limit}`,
    2 * 60,
    url,
    params,
  );

  return data;
};
