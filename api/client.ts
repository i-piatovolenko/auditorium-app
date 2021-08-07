import { ApolloClient, HttpLink, InMemoryCache, makeVar, split } from "@apollo/client";
import {ACCESS_RIGHTS, Mode, User} from "../models/models";
import { WebSocketLink } from '@apollo/client/link/ws';
import {getMainDefinition} from "@apollo/client/utilities";

const wsLink = new WebSocketLink({
  uri: 'ws://54.75.17.229:4000//subscriptions',
  options: {
    reconnect: true,
    // connectionParams: {
      // authToken: user.authToken,
    // },
  }
});

const httpLink = new HttpLink({
  uri: 'http://54.75.17.229:4000/'
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
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          me: {
            read() {
              return meVar();
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
export const accessRightsVar = makeVar(ACCESS_RIGHTS.USER);
export const modeVar = makeVar(Mode.PRIMARY);
export const minimalClassroomIdsVar = makeVar<number[]>([]);
export const desirableClassroomIdsVar = makeVar<number[]>([]);
export const isMinimalSetupVar = makeVar(true);