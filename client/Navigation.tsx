import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { connect } from 'react-redux';
import LodingScreen from './src/components/Login/LodingScreen';
import LoginScreen from './src/components/Login/LoginScreen';
import Home from './src/components/Home/Home';
import Detail from './src/components/Detail/Detail';
import Search from './src/components/Search/Search';
import Category from './src/components/Category/Category';
import List from './src/components/List/List';
import Navbar from './src/components/Navbar/Navbar';
import { navigationRef } from './RootNavigation';

const Stack = createStackNavigator();

function Navigation({ user } : { user: boolean }) {
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen name="lodingScreen" component={LodingScreen} options={{ headerShown: false, navigationBarHidden: true }} />
          <Stack.Screen name="loginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="detail" component={Detail} options={{ headerShown: false }} />
          <Stack.Screen name="search" component={Search} options={{ headerShown: false }} />
          <Stack.Screen name="category" component={Category} options={{ headerShown: false }} />
          <Stack.Screen name="list" component={List} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
      {user ? <Navbar /> : null}
    </>
  );
}

function mapStateToProps({ userReducer }
    : { userReducer: object}) {
  return {
    user: userReducer,
  };
}

export default connect(mapStateToProps)(Navigation);
