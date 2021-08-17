import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {ApolloProvider} from "@apollo/client";
import {client} from "./api/client";
import {Provider, DefaultTheme} from "react-native-paper";
import PushNotification from "./screens/PushNotification";

export default function App() {
  const colorScheme = useColorScheme();

  const theme = {
    ...DefaultTheme,
    roundness: 8,
    colors: {
      ...DefaultTheme.colors,
      primary: '#2b5dff',
      accent: '#ffc000',
    },
  };

  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <Provider theme={theme}>
          <Navigation colorScheme={colorScheme}/>
          <StatusBar/>
        </Provider>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
