import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {ApolloProvider} from "@apollo/client";
import {client} from "./api/client";
import {Provider, DefaultTheme, ProgressBar} from "react-native-paper";
import {Image, ImageBackground} from "react-native";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3498db',
      accent: '#f1c40f',
    },
  };

  if (!isLoadingComplete) {
    return <ImageBackground source={require('./assets/images/bg.jpg')} style={{
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Image source={require('./assets/images/au_logo_shadow.png')} style={{
        width: '80%',
        resizeMode: 'contain',
        height: 130,
      }}/>
      <ProgressBar indeterminate color='#fff' />
    </ImageBackground>;
  } else {
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
}
