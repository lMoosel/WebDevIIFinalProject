export const typeDefs = `#graphql
type Query {
    getSpotifyAuthUrl: String
}

type Mutation {
    exchangeCodeForSpotifyToken(code: String!): SpotifyAuthResponse
}

type SpotifyAuthResponse {
    accessToken: String
    refreshToken: String
    expiresIn: Int
}
`;
