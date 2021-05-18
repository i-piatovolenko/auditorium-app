import useUsers from "./useUsers";
import {User} from "../models/models";

export const useMe = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') as string);
  const users = useUsers();
  const me: User | undefined = users?.find(item => item.id === currentUser?.id);
  return me;
}