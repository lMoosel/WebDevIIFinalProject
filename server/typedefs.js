export const typeDefs = `#graphql
type Query {
    getSpotifyAuthUrl: String
    getUser(_id: String!): User
    validateUser(email: String!, password: String!): User
    getTopTracks(_id: String!, time_range: String!, offset: Int!, limit: Int!): TopTracks
    getTopArtists(_id: String!, time_range: String!, offset: Int!, limit: Int!): TopArtists
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

type TopTracks {
    href: String!
    limit: Int!
    next: String
    offset: Int!
    previous: String
    total: Int!
    items: [Track!]
}

type TopArtists {
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
type Artists {
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
    artists: Artists


}
`;

