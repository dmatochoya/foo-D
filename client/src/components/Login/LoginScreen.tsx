import * as React from 'react';
import {
  StyleSheet, View, Button, AsyncStorage,
} from 'react-native';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import isUserLoggedIn from '../../redux/actions/userActions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function LoginScreen({ actions }): JSX.Element {
  function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
      const { providerData } = firebaseUser;
      for (let i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID
                && providerData[i].uid === googleUser.getBasicProfile().getId()) {
          return true;
        }
      }
    }
    return false;
  }
  function onSignIn(googleUser) {
    console.log('Google Auth Response', googleUser);
    const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      if (!isUserEqual(googleUser, firebaseUser)) {
        const credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken,
        );

        firebase.auth().signInWithCredential(credential).then((result) => {
          firebase
            .database()
            .ref(`/users/${result.user.uid}`)
            .set({
              gmail: result.user.email,
              profile_picture: result.additionalUserInfo.profile.picture,
              locale: result.additionalUserInfo.profile.locale,
              first_name: result.additionalUserInfo.profile.given_name,
              last_name: result.additionalUserInfo.profile.family_name,
            });
        }).then(() => actions.isUserLoggedIn(true))
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const { email } = error;
            const { credential } = error;
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
    <View style={styles.container}>
      <Button title="Sign in with Google" onPress={() => signInWithGoogleAsync()} />
    </View>
  );
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    actions: bindActionCreators({
      isUserLoggedIn,
    }, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(LoginScreen);
