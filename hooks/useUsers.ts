import {useEffect, useState} from "react";
import {client} from "../api/client";
import {GET_CLASSROOMS} from "../api/operations/queries/classrooms";
import {ISODateString} from "../helpers/helpers";
import {ClassroomType, User} from "../models/models";
import {gql, useQuery} from "@apollo/client";
import {GET_USERS} from "../api/operations/queries/users";

const useUsers = (): Array<User> => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    client.query({query: GET_USERS, fetchPolicy: "cache-first"}).then((data) => {
        setUsers(data.data.users.slice().sort((a: User, b: User) => a.id - b.id));
      });
  }, []);

  return users;
};

export default useUsers;