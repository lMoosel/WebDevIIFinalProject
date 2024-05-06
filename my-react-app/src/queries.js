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

const GET_SPOTIFY_ARTIST = gql`
  query GetSpotifyArtist ($id: String!, $artistId: String!) {
    getSpotifyArtist (_id: $id, artistId: $artistId) {
      external_urls {
        spotify
      }
      followers {
        href
        total
      }
      genres
      href
      id
      images {
        url
        height
        width
      }
      name
      popularity
      type
      uri
    }
  }
`;

const GET_SPOTIFY_ALBUM = gql`
  query GetSpotifyAlbum ($id: String!, $albumId: String!) {
    getSpotifyAlbum (_id: $id, albumId: $albumId) {
      album_type
      total_tracks
      available_markets
      external_urls {
        spotify
      }
      href
      id
      images {
        url
        height
        width
      }
      name
      release_date
      release_date_precision
      restrictions {
        reason
      }
      type
      uri
      artists {
        external_urls {
          spotify
        }
        href
        id
        name
        type
        uri
      }
    }
  }
`;

const GET_SPOTIFY_TRACK = gql`
  query GetSpotifyTrack ($id: String!, $trackId: String!) {
    getSpotifyTrack (_id: $id, trackId: $trackId) {
      album {
        id
      }
      artists {
        id
      }
      available_markets
      disc_number
      duration_ms
      explicit
      external_ids {
        isrc
        ean
        upc
      }
      external_urls {
        spotify
      }
      href
      id
      is_playable
      restrictions {
        reason
      }
      name
      popularity
      preview_url
      track_number
      type
      uri
      is_local
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
    GET_SPOTIFY_ARTIST,
    GET_SPOTIFY_ALBUM,
    GET_SPOTIFY_TRACK,
    CREATE_USER,
    AUTHORIZE_SPOTIFY,
    VALIDATE_USER
}
export default exported;