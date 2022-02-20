import {gql} from "@apollo/client";

export const GIVE_OUT_CLASSROOM_KEY = gql`
  mutation giveOutClassroomKey($input: GiveOutClassroomKeyInput!) {
    giveOutClassroomKey(input: $input) {
      classroom {
        id
        occupied {
          id
          state
        }
      }
      userErrors {
        message
        code
      }
    }
}
`;
