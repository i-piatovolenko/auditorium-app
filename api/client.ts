import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import {ACCESS_RIGHTS, Mode} from "../models/models";

export const client = new ApolloClient({
  uri: 'http://3.142.219.180:4000/',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLogged: {
            read() {
              return isLoggedVar();
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
export const isLoggedVar = makeVar(false);
export const accessRightsVar = makeVar(ACCESS_RIGHTS.USER);
export const modeVar = makeVar(Mode.PRIMARY);
export const minimalClassroomIdsVar = makeVar<number[]>([]);
export const desirableClassroomIdsVar = makeVar<number[]>([]);
export const isMinimalSetupVar = makeVar(true);