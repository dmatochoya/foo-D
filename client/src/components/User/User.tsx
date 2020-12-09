import React from 'react';
import {
  StyleSheet, Text, Image, View, StatusBar, ScrollView, Dimensions, TouchableWithoutFeedback,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { isUserLoggedIn, deleteFromFavoriteRecipes } from '../../redux/actions/userActions';

const styles = StyleSheet.create({
  header: {
    position: 'relative',
    top: 0,
    zIndex: 1,
    width: '100%',
    backgroundColor: 'rgb(230, 84, 84)',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  favoriteCardContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  favoriteCard: {
    borderRadius: 5,
    backgroundColor: 'rgb(242, 242, 242)',
    elevation: 5,
    marginHorizontal: 10,
    marginTop: 4,
    marginBottom: 16,
  },
});

function User({ user, actions, navigation }
  : { user: Object, actions: Object, navigation: Object}) {
  const { width, height } = Dimensions.get('window');
  return (
    <>
      <StatusBar backgroundColor="black" barStyle="light-content" translucent />
      <View style={{ marginTop: StatusBar.currentHeight }}>
        <View style={[styles.header, { paddingVertical: 15 }]}>
          <View style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: 15,
          }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{
                  height: 60, width: 60, borderRadius: 30, marginRight: 10,
                }}
                source={{ uri: user.photoUrl }}
              />
              <Text style={{ color: 'white', fontSize: 20 }}>
                {`${user.givenName} ${user.familyName}`}
              </Text>
            </View>
            <View style={{ position: 'relative', top: 2, marginRight: 10 }}>
              <Icon
                size={30}
                name="ios-log-out"
                type="ionicon"
                color="white"
                onPress={() => {
                  actions.isUserLoggedIn(false);
                  firebase.auth().signOut();
                }}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 }}>
            <Text style={{ color: 'white', fontSize: 18 }}>My recipies</Text>
            <Text style={{ color: 'white', fontSize: 18 }}>My favorites</Text>
          </View>
        </View>
        <ScrollView>
          <View style={{ marginTop: 15, marginBottom: 190, alignItems: 'center' }}>
            {user.favoriteRecipes.length
              ? user.favoriteRecipes.map((recipe: Object) => (
                <Swipeable
                  key={Math.random() * Date.now()}
                  renderLeftActions={() => <View style={{ width }} />}
                  onSwipeableLeftOpen={() => {
                    actions.deleteFromFavoriteRecipes(user, recipe);
                  }}
                >

                  <TouchableWithoutFeedback
                    style={[styles.favoriteCardContainer, { flexDirection: 'row' }]}
                    onPress={() => {
                      navigation.navigate('detail', {
                        recipe,
                      });
                    }}
                  >
                    <View style={[styles.favoriteCard, { flexDirection: 'row', width: width - 30 }]}>
                      <Image
                        style={{
                          height: 100, width: 155, borderRadius: 5, marginRight: 15,
                        }}
                        source={{ uri: recipe.strMealThumb }}
                      />
                      <View style={{
                        flexGrow: 1, paddingRight: 15, justifyContent: 'center', flexDirection: 'row',
                      }}
                      >
                        <Text style={{
                          fontSize: 20, flex: 1, flexWrap: 'wrap', textAlign: 'center', marginTop: 5,
                        }}
                        >
                          {recipe.strMeal}
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </Swipeable>
              ))
              : (
                <View style={{ height: height - 250, justifyContent: 'center' }}>
                  <Text style={{ fontSize: 20, textAlign: 'center' }}>
                    There are no favorite recipes yet
                  </Text>
                </View>
              )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

function mapStateToProps({ userReducer }
  : { userReducer: Object}) {
  return {
    user: userReducer.user,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    actions: bindActionCreators({
      isUserLoggedIn,
      deleteFromFavoriteRecipes,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
