import React, { useEffect } from 'react';
import {
  StyleSheet, View, ActivityIndicator, StatusBar, AsyncStorage,
} from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { isUserLoggedIn, getUserFromDB } from '../../redux/actions/userActions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function LoadingScreen({ navigation, actions } : { navigation: Object, actions: Object}) {
  const checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
      setTimeout(() => {
        if (user) {
          actions.getUserFromDB(user.uid);
          actions.isUserLoggedIn(true);
          navigation.navigate('home');
        } else {
          navigation.navigate('loginScreen');
        }
      }, 2000);
    });
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, []);
  return (
    <>
      <StatusBar backgroundColor="black" barStyle="light-content" translucent />
      <View style={styles.container}>
        <ActivityIndicator size={60} color="black" />
      </View>
    </>
  );
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    actions: bindActionCreators({
      isUserLoggedIn,
      getUserFromDB,
    }, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(LoadingScreen);