import {ApolloClient, createHttpLink, from, InMemoryCache, split} from "@apollo/client";
import {getMainDefinition} from "@apollo/client/utilities";
import userErrorsLink from "./links/userErrorsLink";
import wsLink from "./links/wsLink";
import authLink from "./links/authLink";
import errorLink from "./links/errorLink";
import {localFields} from "./localClient";

const ENV = {
  prod: {
    wss: 'wss://api.knmau.auditorium.com.ua/',
    https: 'https://api.knmau.auditorium.com.ua/',
  },
  stg: {
    wss: 'wss://api.knmau.auditorium.com.ua/',
    https: 'https://staging.api.knmau.auditorium.com.ua/',
  }
}

const CURRENT_ENV = ENV.prod;

const httpLink = createHttpLink({
  uri: CURRENT_ENV.https
});

const splitLink = split(
  ({query}) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const client = new ApolloClient({
  link: from([userErrorsLink, errorLink, authLink, splitLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: localFields,
      },
    },
  }),
});
