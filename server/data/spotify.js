import axios from "axios";
import { users as usersCollection } from "./config/mongoCollections.js";
import {
  client,
  checkCache,
  addToCache,
  removeFromCache,
  clearUserCache,
} from "./data/cache.js";

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
      await client.rPush(`spotify:${_id}`, key);
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

export const getCurrentSong = () => {
  //https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback
  return false;
};

export const getFavoriteAlbums = () => {
  //No Explicit API
  return true;
};

export const getFavoriteGenres = () => {
  //No Explicit API
  return null;
};

export const getFavoriteArtists = () => {
  //https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return null;
};

export const getFavoriteSongs = () => {
  //https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return null;
};

export const getAverageListeningSession = () => {
  //Not sure if this one is possible
  return null;
};

