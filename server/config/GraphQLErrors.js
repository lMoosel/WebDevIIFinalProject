import { GraphQLError } from "graphql";

export const BAD_USER_DATA = {
  extensions: {
    code: "BAD_USER_INPUT",
  },
};

export const INTERNAL_ERROR = {
  extensions: {
    code: "INTERNAL_SERVER_ERROR",
  },
};

export const NOT_AUTHORIZED = {
  extensions: {
    code: "NOT_AUTHORIZED",
  },
};

export const NOT_FOUND = {
  extensions: {
    code: "NOT_FOUND",
  },
};
