import {onError} from "@apollo/client/link/error";
import {removeItem} from "../asyncStorage";
import {meVar, noConnectionVar, noTokenVar} from "../localClient";

const errorLink = onError(({graphQLErrors, networkError}) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({
                             message,
                             locations,
                             path
                           }) => {

        if (message === 'AUTHENTICATION_ERROR') {
          noTokenVar(true);
          removeItem('token');
          removeItem('user');
          meVar(null);
        }
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        throw new Error('Сталася помилка!');
      }
    );
  }

  // @ts-ignore
  if (networkError && networkError.bodyText === 'Invalid options provided to ApolloServer: BAD_TOKEN') {
    noTokenVar(true);
    removeItem('token');
    removeItem('user');
  } else if (networkError && networkError.message === 'Failed to fetch') {
    noConnectionVar(true);
  } else {
    noTokenVar(false);
    noConnectionVar(false);
  }
});

export default errorLink;
