import {useEffect, useState} from "react";
import {client} from "../api/client";
import {User} from "../models/models";
import {GET_USERS} from "../api/operations/queries/users";
import {globalErrorVar} from "../api/localClient";

const useUsers = (): Array<User> => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    try {
    client.query({query: GET_USERS, fetchPolicy: "cache-first"}).then((data) => {
      setUsers(data.data.users.slice().sort((a: User, b: User) => a.id - b.id));
    });
    } catch (e: any) {
      globalErrorVar(e.message);
    }
  }, []);

  return users;
};

export default useUsers;
