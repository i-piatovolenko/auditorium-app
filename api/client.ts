import {ApolloClient, createHttpLink, InMemoryCache, makeVar, split} from "@apollo/client";
import {ACCESS_RIGHTS, Langs, Mode, User} from "../models/models";
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from "@apollo/client/utilities";
import {setContext} from "@apollo/client/link/context";
import {getItem} from "./asyncStorage";

const wsLink = new WebSocketLink({
  uri: 'ws://54.75.17.229:4000/',
  options: {
    reconnect: true,
    // connectionParams: {
    //   authToken: user.authToken,
    // },
  }
});

const httpLink = createHttpLink({
  uri: 'http://54.75.17.229:4000/'
});

const authLink = setContext(async function(_, { headers }) {
  const token = await getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const splitLink = split(
  ({ query }) => {
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
  link: authLink.concat(splitLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          me: {
            read() {
              return meVar();
            },
          },
          lang: {
            read() {
              return langVar();
            },
          },
          accessRights: {
            read() {
              return accessRightsVar();
            },
          },
          mode: {
            read() {
              return modeVar();
            },
          },
          minimalClassroomIds: {
            read() {
              return minimalClassroomIdsVar();
            },

          },
          desirableClassroomIds: {
            read() {
              return desirableClassroomIdsVar();
            },
          },
          isMinimalSetup: {
            read() {
              return isMinimalSetupVar();
            },
          },
        },
      },
    },
  }),
});

export const meVar = makeVar<User | null>(null);
export const langVar = makeVar<Langs>(Langs.UA);
export const accessRightsVar = makeVar(ACCESS_RIGHTS.USER);
export const modeVar = makeVar(Mode.PRIMARY);
export const minimalClassroomIdsVar = makeVar<number[]>([]);
export const desirableClassroomIdsVar = makeVar<number[]>([]);
export const isMinimalSetupVar = makeVar(true);