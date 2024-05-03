import { gql } from '@apollo/client';

const GET_SPOTIFY_AUTH_URL = gql`
  query GetSpotifyAuthUrl {
    getSpotifyAuthUrl
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      _id
      email
      authorized
    }
  }
`;

const AUTHORIZE_SPOTIFY = gql`
    mutation AuthorizeSpotify($id: String!, $code: String!) {
    authorizeSpotify(_id: $id, code: $code) {
      _id
      email
      authorized
    }
  }
`;

const exported = {
    GET_SPOTIFY_AUTH_URL,
    CREATE_USER,
    AUTHORIZE_SPOTIFY
}
export default exported;