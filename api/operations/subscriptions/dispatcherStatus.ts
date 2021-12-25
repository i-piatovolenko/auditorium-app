import {gql} from "@apollo/client/core";

export const FOLLOW_DISPATCHER_STATUS = gql`
 subscription dispatcherActiveUpdate {
    dispatcherActiveUpdate
}
`;