import { GraphQLError } from "graphql";
import { v4 as uuid } from "uuid";
import { ObjectId } from "mongodb";
//import moment from "moment";
import axios from "axios";
import { users as usersCollection } from "./config/mongoCollections.js";
import bcrypt from "bcrypt";
import { Graph } from "redis";
import * as errors from "./config/GraphQLErrors.js";

import {
  client,
  checkCache,
  addToCache,
  removeFromCache,
  clearUserCache,
} from "./data/cache.js";
import {
  calculateAverages,
  verifyType,
  charIsLowercase,
  charIsNumber,
  validateDate,
  isValidEmail,
  validateArgsString,
  validatePassword,
  isValidId,
  verifyTimeRange,
  verifyOffset,
  verifyLimit,
} from "./helpers.js";
import {
  getRecords,
  getRecordById,
  getRecordsByIds,
  insertRecord,
} from "./data/records.js";
import {
  getAccessToken,
  handleResponse,
  getAxiosCall,
  get,
  getRecentTracks,
  getFavoriteGenres,
  getFavoriteAlbums,
} from "./data/spotify.js";

export const resolvers = {
  Query: {
    getOnlineFriends: async (_, { _id }) => {
      try {
        const users = await usersCollection();
        const user = await users.findOne({ _id: new ObjectId(_id) });
        if (!user) {
          throw new GraphQLError("Could not find user", errors.BAD_USER_DATA);
        }
        const friends = user.friends;
        const onlineFriends = [];
        const offlineFriends = [];
        for (const friendId of friends) {
          try {
            const playingStatus = await get(
              friendId,
              `getSpotifyCurrentlyPlaying:${friendId}`,
              30,
              "https://api.spotify.com/v1/me/player/currently-playing",
            );
            if (playingStatus && playingStatus.is_playing) {
              const friendDetails = await users.findOne({
                _id: new ObjectId(friendId),
              });
              onlineFriends.push({
                _id: friendDetails._id.toString(),
                username: friendDetails.username,
                profile_picture: friendDetails.profile_picture,
                track_name: playingStatus.item.name,
                trackid: playingStatus.item.id,
              });
            } else {
              const friendDetails = await users.findOne({ _id: new ObjectId(friendId) });
              offlineFriends.push({
                _id: friendDetails._id.toString(),
                username: friendDetails.username,
                profile_picture: friendDetails.profile_picture,
              });
            }
          } catch (error2) {
            console.error(
              `Error fetching Spotify currently playing for friend ${friendId}:`,
              error2,
            );
          }
        }
        let result = { online: onlineFriends, offline: offlineFriends };
        return result;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    getSuggestedFriends: async (_, { _id }) => {
      try {
        const cache = await checkCache(`suggestedFriends:${_id}`);
        if (cache) {
          return cache;
        }
        isValidId(_id);
        const users = await usersCollection();
        const user = await users.findOne({ _id: new ObjectId(_id) });
        if (!user) {
          throw new GraphQLError("Could not find user", errors.BAD_USER_DATA);
        }
        const friends = user.friends.map(id => new ObjectId(id));
        // Retrieve the friends' documents from the database
        const friendDocs = await users.find({ _id: { $in: friends } }).toArray();
        
        if (friendDocs.length !== 0) {
          // Retrieve the friends' friends arrays
          const friendsFriends = [];
          for (const friend of friendDocs) {
              for (let i = 0; i < friend.friends.length; i++) {
                const prospectiveFriend = await users.findOne({ _id: new ObjectId(friend.friends[i])});
                if (prospectiveFriend) {
                    friendsFriends.push(new ObjectId(friend.friends[i]));
                }
            }
          }
          
          const suggested = await users.find({
            _id: { $in: friendsFriends, $ne: new ObjectId(_id) },
            friendRequests: { $nin: [_id] }
          }).toArray();
    
          const filteredSuggested = suggested.filter(suggestedUser => !user.friendRequests.some
            (request => request === suggestedUser._id.toString()));

          const result = filteredSuggested.map((user) => ({
            _id: user._id.toString(),
            username: user.username,
            profile_picture: user.profile_picture,
          }));

          await addToCache(`suggestedFriends:${_id}`, result, 60 * 60);

          return result;
        // No friends (suggest everyone)
        } else {
          const suggested = await users
            .find({
              _id: { $ne: new ObjectId(_id) },
              friendRequests: { $nin: [_id] },
            })
            .toArray();

          const filteredSuggested = suggested.filter(
            (suggestedUser) =>
              !user.friendRequests.some(
                (request) => request === suggestedUser._id.toString(),
              ),
          );

          const result = filteredSuggested.map((user) => ({
            _id: user._id.toString(),
            username: user.username,
            profile_picture: user.profile_picture,
          }));

          await addToCache(`suggestedFriends:${_id}`, result, 60 * 60);

          return result;
        }
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    getFriendRequests: async (_, { _id }) => {
      try {
        const cache = await checkCache(`friendRequests:${_id}`);
        if (cache) {
          console.log("Grabbing from friend requests cache");
          return cache;
        }
        isValidId(_id);
        const users = await usersCollection();
        const user = await users.findOne({ _id: new ObjectId(_id) });
        if (!user) {
          throw new GraphQLError("Could not find user", errors.BAD_USER_DATA);
        }

        const objectIds = user.friendRequests.map((id) => new ObjectId(id));

        const requests = await users
          .find({
            _id: { $in: objectIds },
          })
          .toArray();

        const result = requests.map((user) => ({
          _id: user._id.toString(),
          username: user.username,
          profile_picture: user.profile_picture,
        }));

        await addToCache(`friendRequests:${_id}`, result, 60 * 60);

        console.log("Does this run?");
        return result;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    searchUsersByName: async (_, { query }) => {
      try {
        validateArgsString([query]);
      } catch (e) {
        throw new GraphQLError(e, errors.BAD_USER_DATA);
      }
      const users = await usersCollection();
      const regex = new RegExp(query, "i");
      let allUsers = await users
        .find({ username: { $regex: regex } })
        .toArray();
      if (!allUsers) {
        // Could not get list
        throw new GraphQLError(
          `Could not get list of all users`,
          errors.INTERNAL_ERROR,
        );
      }
      allUsers = allUsers.map((element) => {
        element._id = element._id.toString();
        return element;
      });
      return allUsers;
    },
    getSpotifyAuthUrl: () => {
      const state = uuid();
      const scope =
        "user-read-private user-read-email user-top-read user-read-currently-playing user-read-recently-played"; //This is important, change this if u want to use calls that need diff perms
      const clientId = process.env.SPOTIFY_CLIENT_ID;
      const redirectUri = process.env.REDIRECT_URI;
      const params = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state,
      });
      return `https://accounts.spotify.com/authorize?${params.toString()}`;
    },
    getUser: async (_, { _id }) => {
      try {
        const cache = await checkCache(`user:${_id}`);
        if (cache) {
          return cache;
        }
        isValidId(_id);
        const users = await usersCollection();
        const user = await users.findOne({ _id: new ObjectId(_id) });
        if (!user) {
          throw new GraphQLError("Could not find user", errors.BAD_USER_DATA);
        }
        const ret = {
          _id: user._id.toString(),
          profile_picture: user.profile_picture,
          username: user.username,
          email: user.email,
          friendRequests: user.friendRequests,
          friends: user.friends,
        };
        await addToCache(`user:${_id}`, ret, 60 * 60);
        return ret;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    getSpotifyProfile: async (_, { _id }) => {
      try {
        const response = await get(
          _id,
          `getSpotifyProfile:${_id}`,
          15 * 60,
          "https://api.spotify.com/v1/me",
        );
        return response;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    getSpotifyTopArtists: async (_, { _id, time_range, limit, offset }) => {
      try {
        verifyLimit(limit);
        verifyOffset(offset);
        verifyTimeRange(time_range);
        const params = new URLSearchParams({
          limit: limit,
          offset: offset,
          time_range: time_range,
        });
        const response = await get(
          _id,
          `getTopArtists:${_id}:${params.toString()}`,
          60 * 60 * 24,
          "https://api.spotify.com/v1/me/top/artists",
          params,
        );
        return response;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    getSpotifyTopTracks: async (_, { _id, time_range, limit, offset }) => {
      try {
        verifyLimit(limit);
        verifyOffset(offset);
        verifyTimeRange(time_range);
        const params = new URLSearchParams({
          limit: limit,
          offset: offset,
          time_range: time_range,
        });
        const response = await get(
          _id,
          `getTopTracks:${_id}:${params.toString()}`,
          60 * 60 * 24,
          "https://api.spotify.com/v1/me/top/tracks",
          params,
        );
        return response;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    getSpotifyTopAlbums: async (_, { _id, time_range, limit }) => {
      try {
        return await getFavoriteAlbums(_id, time_range, limit);
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    getSpotifyTopGenres: async (_, { _id, time_range, limit }) => {
      try {
        return await getFavoriteGenres(_id, time_range, limit);
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    getSpotifyArtist: async (_, { _id, artistId }) => {
      try {
        const response = await get(
          _id,
          `getSpotifyArtist:${artistId}`,
          60 * 60 * 24,
          `https://api.spotify.com/v1/artists/${artistId}`,
        );
        return response;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    getSpotifyArtistTopSongs: async (_, { _id, artistId }) => {
      try {
        const response = await get(
          _id,
          `getSpotifyArtistTopSongs:${artistId}`,
          60 * 60 * 24,
          `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
        );
        return response.tracks;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    getSpotifyArtistRelatedArtists: async (_, { _id, artistId }) => {
      try {
        const response = await get(
          _id,
          `getSpotifyArtistRelatedArtists:${artistId}`,
          60 * 60 * 24,
          `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
        );
        return response.artists;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    getSpotifyTrack: async (_, { _id, trackId }) => {
      try {
        const response = await get(
          _id,
          `getSpotifyTrack:${trackId}`,
          60 * 60 * 24,
          `https://api.spotify.com/v1/tracks/${trackId}`,
        );
        return response;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    getSpotifyAlbum: async (_, { _id, albumId }) => {
      try {
        const response = await get(
          _id,
          `getSpotifyAlbum:${albumId}`,
          60 * 60 * 24,
          `https://api.spotify.com/v1/albums/${albumId}`,
        );
        return response;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    getSpotifySearch: async (_, { _id, query, type, limit, offset }) => {
      try {
        validateArgsString([query]);
        verifyLimit(limit);
        verifyOffset(offset);
        verifyType(type);
        const params = new URLSearchParams({
          limit: limit,
          offset: offset,
          query: query,
          type: type,
        });
        const response = await get(
          _id,
          `getSpotifySearch:${params.toString()}`,
          60 * 60 * 24,
          "https://api.spotify.com/v1/search",
          params,
        );
        return response;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    getSpotifyCurrentlyPlaying: async (_, { _id }) => {
      try {
        const response = await get(
          _id,
          `getSpotifyCurrentlyPlaying:${_id}`,
          5,
          "https://api.spotify.com/v1/me/player/currently-playing",
        );
        return response;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    getSpotifyRecentTracks: async (_, { _id, limit }) => {
      isValidId(_id);

      if (limit < 0 || limit > 100) {
        throw new GraphQLError(
          "limit needs to be between 0 and 100",
          errors.BAD_USER_DATA,
        );
      }

      return await getRecentTracks(_id, limit);
    },
    getSpotifyTrackAudioFeatures: async (_, { _id, trackId }) => {
      try {
        const response = await get(
          _id,
          `getSpotifyTrackAudioFeatures:${trackId}`,
          60 * 60 * 24,
          `https://api.spotify.com/v1/audio-features/${trackId}`,
        );
        return response;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    getUserStats: async (_, { _id }) => {
      try {
        const cache = await checkCache(`getUserStats:${_id}`);
        if (cache) {
          return cache;
        }
        const params = new URLSearchParams({
          limit: 50, //Can only get 50 at a time so could mess with offset to get a larger data pool
          offset: 0,
          time_range: "long_term", //Could make this a param
        });
        const response = await get(
          _id,
          `getTopTracks:${_id}:${params.toString()}`,
          60 * 60 * 24,
          "https://api.spotify.com/v1/me/top/tracks",
          params,
        );
        const ids = response.items.map((item) => item.id);
        const ids_comma = ids.join(",");
        const response2 = await get(
          _id,
          `getSpotifyTrackAudioFeatures:ids=${ids_comma}`,
          60 * 60 * 24,
          `https://api.spotify.com/v1/audio-features?ids=${ids_comma}`,
        );
        const avgs = calculateAverages(response2.audio_features);
        await addToCache(`getUserStats:${_id}`, avgs, 60 * 60 * 24);
        return avgs;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
  },
  Mutation: {
    authorizeSpotify: async (_, { code }) => {
      try {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        const redirectUri = process.env.REDIRECT_URI;
        const params = new URLSearchParams({
          code: code,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
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
        const response = await axios.post(
          options.url,
          options.form.toString(),
          {
            headers: options.headers,
          },
        );
        if (response.status === 200) {
          const ret = await getAxiosCall(
            "https://api.spotify.com/v1/me",
            response.data.access_token,
            null,
          );
          const data = {
            refresh_token: response.data.refresh_token,
            access_token: response.data.access_token,
            username: ret.data.display_name,
            email: ret.data.email,
            profile_picture: ret.data.images,
            spotifyId: ret.data.id,
          };
          const users = await usersCollection();
          const user = await users.findOne({
            //Doesnt allow duplicate spotify accounts in our system
            spotifyId: { $regex: new RegExp("^" + ret.data.id + "$", "i") },
          });
          if (user) {
            throw new GraphQLError(
              "Spotify account already in use.",
              errors.BAD_USER_DATA,
            );
          }
          await addToCache(code, data, 60 * 15);
          return ret.data;
        } else {
          throw new GraphQLError(
            `Request completed but status not OK: ${response.status}`,
            errors.INTERNAL_ERROR,
          );
        }
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    validateUser: async (_, { email, password }) => {
      try {
        validateArgsString([email, password]);
        validatePassword(password);
        isValidEmail(email);
        email = email.trim();
        password = password.trim();
        const users = await usersCollection();
        const user = await users.findOne({
          email: { $regex: new RegExp("^" + email + "$", "i") },
        });
        if (!user) {
          throw new GraphQLError(
            "Either password or email is invalid",
            errors.BAD_USER_DATA,
          );
        }
        const compare = await bcrypt.compare(password, user.password);
        if (!compare) {
          throw new GraphQLError(
            "Either password or email is invalid",
            errors.BAD_USER_DATA,
          );
        }
        const ret = {
          _id: user._id.toString(),
          profile_picture: user.profile_picture,
          username: user.username,
          email: user.email,
          friendRequests: user.friendRequests,
          friends: user.friends,
        };
        await addToCache(`user:${user._id.toString()}`, ret, 60 * 60);
        return ret;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    createUser: async (_, { password, code }) => {
      try {
        const response = await checkCache(code);
        if (!response) {
          throw new GraphQLError(
            "Code timed out, please reauthorize.",
            errors.NOT_AUTHORIZED,
          );
        }
        validateArgsString([password]);
        validatePassword(password);
        password = password.trim();
        const saltRounds = 16;
        const hashPass = await bcrypt.hash(password, saltRounds);

        let newUser = {
          _id: new ObjectId(),
          email: response.email,
          password: hashPass,
          refresh_token: response.refresh_token,
          profile_picture: response.profile_picture,
          username: response.username,
          spotifyId: response.spotifyId,
          friends: [],
          friendRequests: [],
        };
        await addToCache(
          `access_token:${newUser._id.toString()}`,
          response.access_token,
          45 * 60,
        );
        const users = await usersCollection();
        let insertedUser = await users.insertOne(newUser);
        if (!insertedUser.acknowledged) {
          throw new GraphQLError(`Could not add user`, errors.BAD_USER_DATA);
        }
        const ret = {
          _id: newUser._id.toString(),
          profile_picture: newUser.profile_picture,
          username: newUser.username,
          email: newUser.email,
          friendRequests: newUser.friendRequests,
          friends: newUser.friends,
        };
        await addToCache(`user:${newUser._id.toString()}`, ret, 60 * 60);
        return ret;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    editUser: async (_, { _id, newEmail, newPassword }) => {
      try {
        const users = await usersCollection();
        let changes = {};

        if (newEmail) {
          newEmail = newEmail.trim();

          isValidEmail(newEmail);

          // Check for existing email
          const user = await users.findOne({
            email: { $regex: new RegExp("^" + newEmail + "$", "i") },
          });

          if (user && user._id.toString() !== _id) {
            throw new GraphQLError(
              "Email address already taken",
              errors.BAD_USER_DATA,
            );
          }

          changes["email"] = newEmail;
        }

        if (newPassword) {
          validatePassword(newPassword);
          newPassword = newPassword.trim();

          const saltRounds = 16;
          changes["password"] = await bcrypt.hash(newPassword, saltRounds);
        }

        isValidId(_id);

        const user = await users.findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $set: changes },
        );

        if (!user) {
          throw new GraphQLError("User does not exist", errors.NOT_FOUND);
        }

        await removeFromCache(`user:${_id}`);
        const ret = {
          _id: user._id.toString(),
          profile_picture: user.profile_picture,
          username: user.username,
          email: user.email,
          friendRequests: user.friendRequests,
          friends: user.friends,
        };
        await addToCache(`user:${_id}`, ret, 60 * 60);
        return ret;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    deleteUser: async (_, { _id }) => {
      try {
        isValidId(_id);

        const users = await usersCollection();
        const user = await users.findOne({ _id: new ObjectId(_id) });

        if (!user) {
          throw new GraphQLError("User does not exist", errors.NOT_FOUND);
        }

        const userRemove = await users.findOneAndDelete(
          { _id: new ObjectId(_id) },
          { returnDocument: "after" },
        );

        if (!userRemove) {
          throw new GraphQLError("Could not remove", errors.INTERNAL_ERROR);
        }

        // Update friends to get rid of user
        user.friends.map((friendId) => {
          const friend = users.findOneAndUpdate(
            { _id: new ObjectId(friendId) },
            { $pull: { friends: _id } },
          );

          if (!friend)
            throw new GraphQLError(
              "Could not update friend while deleting user",
              errors.INTERNAL_ERROR,
            );
        });

        await clearUserCache(`spotify:${_id}`);
        await removeFromCache(`active_token:${_id}`);
        await removeFromCache(`getUserStats:${_id}`);
        await removeFromCache(`user:${_id}`);
        const ret = {
          _id: user._id.toString(),
          profile_picture: user.profile_picture,
          username: user.username,
          email: user.email,
          friendRequests: user.friendRequests,
          friends: user.friends,
        };
        return ret;
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    sendFriendRequest: async (_, { userId, friendId }) => {
      const users = await usersCollection();

      // Input validation
      isValidId(userId);
      isValidId(friendId);

      const user = await users.findOne({
        _id: new ObjectId(userId),
      });

      const friend = await users.findOne({
        _id: new ObjectId(friendId),
      });

      if (!user) throw new GraphQLError("Cannot find user", errors.NOT_FOUND);
      else if (!friend)
        throw new GraphQLError("Cannot find friend", errors.NOT_FOUND);

      // Edge Cases
      if (friend.friendRequests.includes(userId))
        throw new GraphQLError(
          "Already send a friend request",
          errors.BAD_USER_DATA,
        );
      if (friend.friends.includes(userId))
        throw new GraphQLError(
          "Already friends with this person",
          errors.BAD_USER_DATA,
        );
      if (user.friendRequests.includes(friendId))
        throw new GraphQLError(
          "You have a pending request from this person",
          errors.BAD_USER_DATA,
        );

      // Add userId to friend's friendRequests
      const newFriend = users.findOneAndUpdate(
        { _id: new ObjectId(friendId) },
        { $push: { friendRequests: userId } },
      );

      if (!newFriend)
        throw new GraphQLError(
          "Something went wrong when updating friend",
          errors.INTERNAL_ERROR,
        );

      await removeFromCache(`user:${friendId}`);
      await removeFromCache(`friendRequests:${friendId}`);
      await removeFromCache(`suggestedFriends:${userId}`);
      await removeFromCache(`suggestedFriends:${friendId}`);

      return "Friend Request Sent";
    },
    handleFriendRequest: async (_, { userId, friendId, action }) => {
      try {
        const users = await usersCollection();

        // Input validation
        isValidId(userId);
        isValidId(friendId);

        const user = await users.findOne({
          _id: new ObjectId(userId),
        });

        const friend = await users.findOne({
          _id: new ObjectId(friendId),
        });

        if (!user) throw new GraphQLError("Cannot find user", errors.NOT_FOUND);
        else if (!friend) {
          // Remove friend from array bc most likely they have been deleted
          console.log("Friend not found, removing them from array");
          action = "reject";
        }

        // Edge Cases
        console.log("Testing this case");
        console.log(user.friendRequests);
        if (!user.friendRequests.includes(friendId))
          throw new GraphQLError(
            "You don't have a pending request from this person",
            errors.BAD_USER_DATA,
          );

        // Handle request based on action
        if (action === "accept") {
          const updatedUser = await users.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            {
              $pull: { friendRequests: friendId },
              $push: { friends: friendId },
            },
          );

          const updatedFriend = await users.findOneAndUpdate(
            { _id: new ObjectId(friendId) },
            {
              $push: { friends: userId },
            },
          );

          if (!updatedUser || !updatedFriend)
            throw new GraphQLError(
              "Something went wrong when updating user",
              errors.INTERNAL_ERROR,
            );

          await removeFromCache(`user:${userId}`);
          await removeFromCache(`suggestedFriends:${userId}`);
          await removeFromCache(`friendRequests:${userId}`);
          await removeFromCache(`user:${friendId}`);
          await removeFromCache(`suggestedFriends:${friendId}`);

          return "Friend request accepted";
        } else if (action === "reject") {
          const updatedUser = await users.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            {
              $pull: { friendRequests: friendId },
            },
          );

          if (!updatedUser)
            throw new GraphQLError(
              "Something went wrong when updating user",
              errors.INTERNAL_ERROR,
            );

          await removeFromCache(`user:${userId}`);
          await removeFromCache(`suggestedFriends:${userId}`);
          await removeFromCache(`friendRequests:${userId}`);
          await removeFromCache(`user:${friendId}`);
          await removeFromCache(`suggestedFriends:${friendId}`);

          return "Friend request rejected";
        } else
          throw new GraphQLError("Action not recognized", errors.BAD_USER_DATA);
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
    removeFriend: async (_, { userId, friendId }) => {
      try {
        const users = await usersCollection();

        // Input validation
        isValidId(userId);
        isValidId(friendId);

        const user = await users.findOne({
          _id: new ObjectId(userId),
        });

        const friend = await users.findOne({
          _id: new ObjectId(friendId),
        });

        if (!user) throw new GraphQLError("Cannot find user", errors.NOT_FOUND);
        else if (!friend)
          throw new GraphQLError("Cannot find friend", errors.NOT_FOUND);

        // Edge Cases
        if (!user.friends.includes(friendId))
          throw new GraphQLError("You are not friends", errors.BAD_USER_DATA);

        // Remove user and friend from each other's friends array
        const updatedUser = await users.findOneAndUpdate(
          { _id: new ObjectId(userId) },
          { $pull: { friends: friendId } },
        );

        const updatedFriend = await users.findOneAndUpdate(
          { _id: new ObjectId(friendId) },
          { $pull: { friends: userId } },
        );

        if (!updatedUser || !updatedFriend)
          throw new GraphQLError(
            "Something went wrong when removing friend",
            errors.INTERNAL_ERROR,
          );

        await removeFromCache(`user:${userId}`);
        await removeFromCache(`suggestedFriends:${userId}`);
        await removeFromCache(`user:${friendId}`);
        await removeFromCache(`suggestedFriends:${friendId}`);

        return "Removed friend";
      } catch (error) {
        throw new GraphQLError(error.message, error);
      }
    },
  },
};
