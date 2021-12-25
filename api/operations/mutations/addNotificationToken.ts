import {gql} from "@apollo/client";

export const ADD_NOTIFICATION_TOKEN = gql`
    mutation addNotificationToken($input: AddNotificationTokenInput!) {
        addNotificationToken(input: $input) {
          userErrors {
              message
              code
            }
        }
    }
`;