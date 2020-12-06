import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as ReduxProvider } from 'react-redux';
import { navigationRef } from './RootNavigation';
import Home from './src/components/Home/Home';
import Detail from './src/components/Detail/Detail';
import Search from './src/components/Search/Search';
import Category from './src/components/Category/Category';
import List from './src/components/List/List';
import Navbar from './src/components/Navbar/Navbar';
import configureStore from './src/redux/configureStore';
import { getRecipeCategoriesFromAPI } from './src/redux/actions/recipesActions';

const Stack = createStackNavigator();

const store = configureStore({});

store.dispatch(getRecipeCategoriesFromAPI());

export default function App() {
  return (
    <>
      <ReduxProvider store={store}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName="home">
            <Stack.Screen name="home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="detail" component={Detail} options={{ headerShown: false }} />
            <Stack.Screen name="search" component={Search} options={{ headerShown: false }} />
            <Stack.Screen name="category" component={Category} options={{ headerShown: false }} />
            <Stack.Screen name="list" component={List} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
        <Navbar />
      </ReduxProvider>
    </>
  );
}
