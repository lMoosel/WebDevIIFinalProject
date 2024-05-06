import { gql } from '@apollo/client';

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
    CREATE_USER, 
    AUTHORIZE_SPOTIFY,
     VALIDATE_USER
}

export default exported