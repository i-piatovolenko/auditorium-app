import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import {ACCESS_RIGHTS} from "../models/models";

export const client = new ApolloClient({
  uri: 'http://3.141.103.67:4000/',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLogged: {
            read() {
              return isLoggedVar();
            },
          },
          gridUpdate: {
            read() {
              return gridUpdate();
            },
          },
          accessRights: {
            read() {
              return accessRightsVar();
            },
          },
        },
      },
    },
  }),
});
export const isLoggedVar = makeVar(false);
export const gridUpdate = makeVar(false);
export const accessRightsVar = makeVar(ACCESS_RIGHTS.USER);