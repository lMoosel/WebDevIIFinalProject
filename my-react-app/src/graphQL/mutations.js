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

const DELETE_USER = gql`
    mutation DeleteUser ($_id: String!) {
        deleteUser (_id: $_id) {
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

const EDIT_USER = gql`
    mutation EditUser ($_id: String!, $newEmail: String, $newPassword: String) {
        editUser (_id: $_id, newEmail: $newEmail, newPassword: $newPassword) {
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

const SEND_FRIEND_REQUEST = gql`
    mutation SendFriendRequest ($userId: String!, $friendId: String!) {
        sendFriendRequest(userId: $userId, friendId: $friendId) {
            s
        }
    }
`;

const HANDLE_FRIEND_REQUEST = gql`
    mutation HandleFriendRequest ($userId: String!, $friendId: String!, $action: String!) {
        handleFriendRequest(userId: $userId, friendId: $friendId, action: $action) {
            s
        }
    }
`;

const REMOVE_FRIEND = gql`
    mutation RemoveFriend ($userId: String!, $friendId: String!) {
        removeFriend(userId: $userId, friendId: $friendId) {
            s
        }
    }
`;

const exported = {
    CREATE_USER, 
    AUTHORIZE_SPOTIFY,
    VALIDATE_USER,
    DELETE_USER,
    EDIT_USER,
    SEND_FRIEND_REQUEST,
    HANDLE_FRIEND_REQUEST,
    REMOVE_FRIEND
}

export default exported