import {ApolloClient, createHttpLink, from, InMemoryCache, split} from "@apollo/client";
import {getMainDefinition} from "@apollo/client/utilities";
import userErrorsLink from "./links/userErrorsLink";
import wsLink from "./links/wsLink";
import authLink from "./links/authLink";
import errorLink from "./links/errorLink";
import {localFields} from "./localClient";

const ENV = {
  prod: {
    wss: 'wss://api.auditoriu.me/',
    https: 'https://api.auditoriu.me/',
  },
  stg: {
    wss: 'wss://staging.api.auditoriu.me/',
    https: 'https://staging.api.auditoriu.me/',
  }
}

const CURRENT_ENV = ENV.stg;

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
