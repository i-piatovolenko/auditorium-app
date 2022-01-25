import {setContext} from "@apollo/client/link/context";
import {getItem} from "../asyncStorage";

const authLink = setContext(async function (_, {headers}) {
  const token = await getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export default authLink;
