import { gql } from '@apollo/client';

const GET_SPOTIFY_AUTH_URL = gql`
    query {
        getSpotifyAuthUrl
    }
`;
const CREATE_USER = gql`
    createUser {
        user{
            _id
            email
            authorized
        }
    }
`;
const AUTHORIZE_SPOTIFY = gql`
    authorizeSpotify {
        user{
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