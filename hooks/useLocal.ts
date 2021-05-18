import {gql, useQuery} from "@apollo/client";

export const useLocal = (localVarName: string) => {
  return useQuery(gql`
      query ${localVarName} {
        ${localVarName} @client
      }
  `);
};