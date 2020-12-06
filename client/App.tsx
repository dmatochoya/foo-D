import 'react-native-gesture-handler';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import firebase from 'firebase';
import Navigation from './Navigation';
import configureStore from './src/redux/configureStore';
import { getRecipeCategoriesFromAPI } from './src/redux/actions/recipesActions';
import firebaseConfig from './config';

console.ignoredYellowBox = ['Setting a timer'];
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const store = configureStore({});

store.dispatch(getRecipeCategoriesFromAPI());

export default function App() {
  return (
    <ReduxProvider store={store}>
      <Navigation />
    </ReduxProvider>
  );
}
