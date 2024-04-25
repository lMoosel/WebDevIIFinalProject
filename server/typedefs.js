export const typeDefs = `#graphql
type Query {
    getSpotifyAuthUrl: String
    getUser(_id: String!): User
}

type Mutation {
    createUser(email: String!, password: String!): User
    generateRefreshTokenFromCode(_id: String!, code: String!): User
    generateAccessToken(_id: String!) : User
}

type User {
    _id: String!
    email: String!
    access_token: String
}
`;

