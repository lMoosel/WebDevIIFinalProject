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
        artists {
          name
          id
        }
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
        name
      }
      artists {
        id
        name
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

const GET_SPOTIFY_PROFILE = gql`
  query GetSpotifyProfile($id: String!) {
    getSpotifyProfile(_id: $id) {
      country
      display_name
      email
      id
      href
      images {
        url
      }
      product
      type
      uri
    }
  }`;

  const GET_SPOTIFY_SEARCH = gql`
  query Query($id: String!, $query: String!, $limit: Int!, $offset: Int!) {
    getSpotifySearch(_id: $id, query: $query, limit: $limit, offset: $offset) {
      albums {
        items {
          id
          name
        }
      }
      artists {
        items {
          id
          name
        }
      }
      tracks {
        items {
          id
          name
        }
      }
    }
  }`;

    
  const GET_SPOTIFY_TOP_ARTISTS = gql`
  query Query($id: String!, $timeRange: String!, $offset: Int!, $limit: Int!) {
    getSpotifyTopArtists(_id: $id, time_range: $timeRange, offset: $offset, limit: $limit) {
      href
      items {
        name
        id
      }
      limit
      offset
      next
      previous
      total
    }
  }`;

  const GET_SPOTIFY_TOP_TRACKS = gql`
  query Query($id: String!, $timeRange: String!, $offset: Int!, $limit: Int!) {
    getSpotifyTopTracks(_id: $id, time_range: $timeRange, offset: $offset, limit: $limit) {
      href
      items {
        id
        name
      }
      limit
      next
      offset
      previous
      total
    }
  }`;

  const GET_SPOTIFY_TOP_ALBUMS = gql`
  query Query($id: String!, $timeRange: String!, $limit: Int!) {
    getSpotifyTopAlbums(_id: $id, time_range: $timeRange, limit: $limit) {
      name
      id
    }
  }`;

  const GET_SPOTIFY_TOP_GENRES = gql`
  query Query($id: String!, $timeRange: String!, $limit: Int!) {
    getSpotifyTopGenres(_id: $id, time_range: $timeRange, limit: $limit)
  }`;

  const GET_SPOTIFY_TRACK_AUDIO_FEATURES = gql`
  query Query($id: String!, $trackId: String!) {
    getSpotifyTrackAudioFeatures(_id: $id, trackId: $trackId) {
      acousticness
      analysis_url
      danceability
      duration_ms
      energy
      id
      instrumentalness
      key
      liveness
      loudness
      mode
      speechiness
      tempo
      time_signature
      track_href
      type
      uri
      valence
    }
  }`;

  const GET_USER = gql`
  query Query($id: String!) {
    getUser(_id: $id) {
      _id
      email
      friendRequests
      friends
      profile_picture {
        url
      }
      username
    }
  }`;

  const GET_USER_STATS = gql`
  query Query($id: String!) {
    getUserStats(_id: $id) {
      danceability
      acousticness
      duration_ms
      energy
      key
      instrumentalness
      liveness
      loudness
      speechiness
      mode
      tempo
      time_signature
      valence
    }
  }`;
const GET_SUGGESTED_FRIENDS = gql`
  query Query($id: String!) {
    getSuggestedFriends(_id: $id) {
      _id
      username
      profile_picture {
        url
      }
    }
  }`;
  const GET_FRIEND_REQUESTS = gql`
  query Query($id: String!) {
    getFriendRequests(_id: $id) {
      _id
      username
      profile_picture {
        url
      }
    }
  }`;
const GET_ONLINE_FRIENDS = gql`
  query Query($id: String!) {
    getOnlineFriends(_id: $id) {
      _id
      username
      profile_picture {
        url
      }
      track_name
      trackid
    }
  }`;
const exported = {
    GET_SPOTIFY_AUTH_URL,
    GET_SPOTIFY_CURRENTLY_PLAYING,
    GET_SPOTIFY_ARTIST,
    GET_SPOTIFY_ALBUM,
    GET_SPOTIFY_TRACK,
    GET_SPOTIFY_PROFILE,
    GET_SPOTIFY_SEARCH,
    GET_SPOTIFY_TOP_ARTISTS,
    GET_SPOTIFY_TOP_TRACKS,
    GET_SPOTIFY_TOP_ALBUMS,
    GET_SPOTIFY_TOP_GENRES,
    GET_SPOTIFY_TRACK_AUDIO_FEATURES,
    GET_USER,
    GET_USER_STATS,
    GET_SUGGESTED_FRIENDS,
    GET_FRIEND_REQUESTS,
    GET_ONLINE_FRIENDS
}
export default exported;