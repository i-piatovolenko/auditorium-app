import { gql } from "@apollo/client";

export const GET_DEGREES = gql`
    query getDegrees {
        degrees {
            id
            name
            startMonth
            startDay
            durationMonths
        }
    }
`;