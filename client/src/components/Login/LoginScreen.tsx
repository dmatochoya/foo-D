import React from 'react';
import {
  StyleSheet, View, Button, Text,
} from 'react-native';
import { Icon } from 'react-native-elements';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { isUserLoggedIn, postUserInDB, getUserFromDB } from '../../redux/actions/userActions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface ProviderData {
  providerId: string
  uid: string
}

interface Firebase {
  User: object
  providerData: ProviderData[]
}

function LoginScreen({ actions } : { actions: Object}) {
  function isUserEqual(googleUser:
    { getBasicProfile: () => { (): any; new(): any; getId: { (): any; new(): any; }; }; },
  firebaseUser: Firebase) {
    if (firebaseUser) {
      const { providerData } = firebaseUser;
      for (let i = 0; i < providerData.length; i += 1) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID
                && providerData[i].uid === googleUser.getBasicProfile().getId()) {
          return true;
        }
      }
    }
    return false;
  }
  function onSignIn(googleUser: Object) {
    console.log('Google Auth Response', googleUser);
    const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      if (!isUserEqual(googleUser, firebaseUser)) {
        const credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken,
        );

        firebase.auth().signInWithCredential(credential).then((result: Object) => {
          if (result.additionalUserInfo.isNewUser) {
            actions.postUserInDB({ ...googleUser.user, favoriteRecipes: [] });
            firebase
              .database()
              .ref(`/users/${result.user.uid}`)
              .set({
                gmail: result.user.email,
                profile_picture: result.additionalUserInfo.profile.picture,
                locale: result.additionalUserInfo.profile.locale,
                first_name: result.additionalUserInfo.profile.given_name,
                last_name: result.additionalUserInfo.profile.family_name,
                created_at: Date.now(),
              });
          } else {
            actions.getUserFromDB(googleUser.user.id);
            firebase
              .database()
              .ref(`/users/${result.user.uid}`).update({
                last_logged_in: Date.now(),
              });
          }
        }).then(() => { actions.isUserLoggedIn(true); })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const { email } = error;
          });
      } else {
        console.log('User already signed-in Firebase.');
      }
    });
  }
  const signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: '489999849555-5do62o44r40gggb0opk8gb2ltrtmtbm9.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        onSignIn(result);
        return result.accessToken;
      }
      return { cancelled: true };
    } catch (e) {
      console.log(e);
      return { error: true };
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: 'rgb(230, 84, 84)' }]}>
      <View style={{ flexDirection: 'row', backgroundColor: 'white' }} onTouchEnd={() => signInWithGoogleAsync()}>
        <Icon size={30} name="logo-google" type="ionicon" />
        <Text>Sign in with Google</Text>
      </View>
    </View>
  );
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    actions: bindActionCreators({
      isUserLoggedIn,
      getUserFromDB,
      postUserInDB,
    }, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(LoginScreen);
