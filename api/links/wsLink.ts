import {WebSocketLink} from "@apollo/client/link/ws";
import {getItem} from "../asyncStorage";

const ENV = {
  prod: {
    wss: 'wss://api.auditoriu.me/',
    https: 'https://api.auditoriu.me/',
  },
  stg: {
    wss: 'wss://staging.api.auditoriu.me/',
    https: 'https://staging.api.auditoriu.me/',
  }
}

const CURRENT_ENV = ENV.stg;

const wsLink: any = new WebSocketLink({
    uri: CURRENT_ENV.wss,
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: async () => {
        const token = await getItem('token');
        return {
          authorization: token ? `Bearer ${token}` : "",
        }
      }
    }
  }
);

const subscriptionMiddleware = {
  applyMiddleware: async (options: any, next: any) => {
    const token = await getItem('token');
    options.authorization = token ? `Bearer ${token}` : ""
    next();
  },
}

wsLink.subscriptionClient.use([subscriptionMiddleware]);

export default wsLink;
