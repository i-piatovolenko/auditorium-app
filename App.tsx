import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {ApolloProvider} from "@apollo/client";
import {client} from "./api/client";
import {Provider, DefaultTheme} from "react-native-paper";
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import en from './localization/en.json';
import ua from './localization/ua.json';

i18n.locale = Localization.locale;
i18n.fallbacks = true;
i18n.translations = {en, ua};

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
