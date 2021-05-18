import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {ApolloProvider} from "@apollo/client";
import {client} from "./api/client";
import {Provider} from "react-native-paper";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <SafeAreaProvider>
          <Provider>
            <Navigation colorScheme={colorScheme}/>
            <StatusBar/>
          </Provider>
        </SafeAreaProvider>
      </ApolloProvider>
    );
  }
}
