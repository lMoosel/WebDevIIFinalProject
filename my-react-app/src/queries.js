import { gql } from '@apollo/client';

const GET_SPOTIFY_AUTH_URL = gql`
  query GetSpotifyAuthUrl {
    getSpotifyAuthUrl
  }
`;

const GET_SPOTIFY_CURRENTLY_PLAYING = gql`
  query GetSpotifyCurrentlyPlaying ($id: String!) {
    getSpotifyCurrentlyPlaying (_id: $id) {
      repeat_state
      shuffle_state
      # timestamp
      progress_ms
      is_playing
      item {
        id
        name
      }
      currently_playing_type
    }
  }
`;

const CREATE_USER = gql`
    mutation CreateUser($password: String!, $code: String!) {
    createUser(password: $password, code: $code) {
        _id
        email
        username
        profile_picture {
            url
            height
            width
        }
        friends
        friendRequests
    }
  }
`;

const AUTHORIZE_SPOTIFY = gql`
    mutation AuthorizeSpotify($code: String!) {
    authorizeSpotify(code: $code) {
        display_name
        email
        images {
            url
            height
            width
        }
    }
  }
`;
const VALIDATE_USER = gql`
    mutation ValidateUser($email: String!, $password: String!) {
    validateUser(email: $email, password: $password) {
        _id
        email
        profile_picture {
            url
            height
            width
        }
        username
        friends
        friendRequests
    }
  }
`;
const exported = {
    GET_SPOTIFY_AUTH_URL,
    GET_SPOTIFY_CURRENTLY_PLAYING,
    CREATE_USER,
    AUTHORIZE_SPOTIFY,
    VALIDATE_USER
}
export default exported;