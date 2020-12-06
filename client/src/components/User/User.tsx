import React from 'react';
import {
  StyleSheet, Text, Button,
} from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import isUserLoggedIn from '../../redux/actions/userActions';

function User({ actions } : { actions: Object}) {
  return (
    <>
      <Text>User profile</Text>
      <Button
        title="Sing out"
        onPress={() => {
          actions.isUserLoggedIn(false);
          firebase.auth().signOut();
        }}
      />
    </>
  );
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    actions: bindActionCreators({
      isUserLoggedIn,
    }, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(User);
