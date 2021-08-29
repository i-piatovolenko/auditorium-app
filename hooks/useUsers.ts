import {useEffect, useState} from "react";
import {client} from "../api/client";
import {User} from "../models/models";
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