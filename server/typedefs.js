export const typeDefs = `#graphql
type Query {
    getSpotifyAuthUrl: String
    getUser(_id: String!): User
    validateUser(email: String!, password: String!): User
    getSpotifyTopTracks(_id: String!, time_range: String!, offset: Int!, limit: Int!): TracksResponse
    getSpotifyTopArtists(_id: String!, time_range: String!, offset: Int!, limit: Int!): ArtistsResponse
    getSpotifyProfile(_id: String!): SpotifyProfile
    getSpotifyArtist(_id: String!, artistId: String!): Artist
    getSpotifyTrack(_id: String!, trackId: String!): Track
    getSpotifyAlbum(_id: String!, albumId: String!): Album
    getSpotifySearch(_id: String!, query: String!, type: [String!], limit: Int!, offset: Int!): SearchResponse
    getSpotifyCurrentlyPlaying(_id: String!): CurrentlyPlayingResponse
}

type Mutation {
    createUser(email: String!, password: String!): User
    deleteUser(_id: String!) : User
    authorizeSpotify(_id: String!, code: String!): User
    deauthorizeSpotify(_id: String!) : User
}

type User {
    _id: String!
    email: String!
    authorized: Boolean
}
type SearchResponse {
    tracks: TracksResponse
    artists: ArtistsResponse
    albums: AlbumsResponse
}
type SpotifyProfile {
    country: String
    display_name: String
    email: String
    explicit_content: ExplicitContent
    external_urls: ExternalUrls
    followers: Followers
    href: String
    id: String
    images: [Image]
    product: String
    type: String
    uri: String
}
type Followers {
    href: String
    total: Int
}
type ExplicitContent {
    filter_enabled: Boolean
    filter_locked: Boolean
}
type TracksResponse {
    href: String!
    limit: Int!
    next: String
    offset: Int!
    previous: String
    total: Int!
    items: [Track!]
}
type AlbumsResponse {
    href: String!
    limit: Int!
    next: String
    offset: Int!
    previous: String
    total: Int!
    items: [Album!]
}

type ArtistsResponse {
    href: String!
    limit: Int!
    next: String
    offset: Int!
    previous: String
    total: Int!
    items: [Artist!]  
}


type ExternalUrls {
    spotify: String
}
type Followers {
    href: String
    total: Int
}
type Artist {
    external_urls: ExternalUrls
    followers : Followers
    genres: [String]
    href: String
    id: String
    images: [Image]
    name: String
    popularity: Int
    type: String
    uri: String
}
type ExternalIds {
    isrc: String
    ean: String
    upc: String
}
type Restrictions {
    reason: String
}
type Track {
    album: Album
    artists: [Artist]
    available_markets: [String]
    disc_number: Int
    duration_ms: Int
    explicit: Boolean
    external_ids: ExternalIds
    external_urls: ExternalUrls
    href: String
    id: String
    is_playable: Boolean
    restrictions: Restrictions
    name: String
    popularity: Int
    preview_url: String
    track_number: Int
    type: String
    uri: String
    is_local: Boolean
}
type Image {
    url: String!,
    height: Int!
    width: Int!
}
type ArtistSimp {
    external_urls: ExternalUrls
    href: String
    id: String
    name: String
    type: String
    uri: String
}
type Album {
    album_type: String!
    total_tracks: Int!
    available_markets: [String!]
    external_urls: ExternalUrls
    href: String!
    id: String!
    images: [Image!]
    name: String!
    release_date: String!
    release_date_precision: String!
    restrictions: Restrictions
    type: String!
    uri: String!
    artists: [ArtistSimp]


}

type CurrentlyPlayingResponse {
    repeat_state: String
    shuffle_state: Boolean
    timestamp: Int
    progress_ms: Int
    is_playing: Boolean
    item: Track
    currently_playing_type: String
}

`;

