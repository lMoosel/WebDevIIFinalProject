import { gql } from '@apollo/client';

const GET_SPOTIFY_AUTH_URL = gql`
  query GetSpotifyAuthUrl {
    getSpotifyAuthUrl
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($password: String!, $code: String!) {
    createUser(password: $password, code: $code) {
      _id
      email
      authorized
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

const exported = {
    GET_SPOTIFY_AUTH_URL,
    CREATE_USER,
    AUTHORIZE_SPOTIFY
}
export default exported;