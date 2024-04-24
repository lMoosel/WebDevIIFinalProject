export const typeDefs = `#graphql
type Query {
    getSpotifyAuthUrl: String
}

type Mutation {
    exchangeCode(code: String!): SpotifyAuthResponse
    exchangeRefreshToken(refresh_token: String!) : SpotifyAuthResponse
}

type SpotifyAuthResponse {
    access_token: String
    token_type: String
    refresh_token: String
}
`;
