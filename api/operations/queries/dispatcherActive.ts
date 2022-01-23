import {gql} from "@apollo/client";

export const DISPATCHER_STATUS = gql`
  query dispatcherActive {
    dispatcherActive
  }`;
