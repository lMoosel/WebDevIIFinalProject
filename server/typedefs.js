export const typeDefs = `#graphql
type Query {
    getSpotifyAuthUrl: String
    getUser(_id: String!): User
    validateUser(email: String!, password: String!): User
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
    access_token: String
}
`;

