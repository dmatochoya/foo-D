import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, BackHandler, Text, StatusBar, Image, Dimensions, ScrollView, Button,
} from 'react-native';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { isUserSelectingMenu } from '../../redux/actions/userActions';

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: StatusBar.currentHeight,
    height: 70,
    backgroundColor: 'rgb(249, 244, 241)',
    fontSize: 30,
    color: 'black',
    textShadowColor: 'white',
    textShadowOffset: { width: 2, height: 2 },
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    borderBottomWidth: 1.5,
    width: '90%',
    paddingBottom: 15,
    lineHeight: 65,
    alignSelf: 'center',
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

const SelectMenu = ({ user, route: { params: { date } }, actions }) => {
  const { width, height } = Dimensions.get('window');
  const [selectMenuSection, setSelectMenuSection] = useState();

  const selectMenuSectionObject = {};

  user.favoriteRecipes.forEach((recipe) => {
    selectMenuSectionObject[`${recipe.strMeal}`] = 'none';
  });

  useEffect(() => {
    console.log(selectMenuSectionObject, 'holi');
    setSelectMenuSection(selectMenuSectionObject);
    console.log(selectMenuSection);
  }, []);

  useEffect(() => {
    const goBackAndShowNavbar = () => {
      actions.isUserSelectingMenu(false);
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      goBackAndShowNavbar,
    );

    return () => backHandler.remove();
  }, []);

  const dateArray = date.split('');
  dateArray.splice(date.split('').findIndex((character) => !Number.isNaN(+character)), 0, ' ');
  return (
    <>
      <StatusBar backgroundColor="black" barStyle="light-content" translucent />
      <View style={{ height }}>
        <Text style={styles.sectionTitle}>{dateArray.join('')}</Text>
        <View>
          <View>
            <Text style={{
              textAlign: 'center', fontSize: 20, backgroundColor: 'rgb(230, 84, 84)', color: 'white', height: 40, lineHeight: 40,
            }}
            >
              MY FAVORITES
            </Text>
            <ScrollView style={{
              paddingTop: 19, marginBottom: 270,
            }}
            >
              <View style={{ alignItems: 'center', paddingBottom: 30 }}>
                {user.favoriteRecipes.length
              && user.favoriteRecipes.map((recipe: Object) => (
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
                  <View style={{
                    position: 'absolute', top: 10, left: 10, flexDirection: 'row',
                  }}
                  >
                    <Text
                      style={{
                        fontSize: 30, fontFamily: 'serif', backgroundColor: 'white', height: 20, width: 20, lineHeight: 28, borderRadius: 20, textAlign: 'center',
                      }}
                      onPress={() => {
                        if (selectMenuSection[`${recipe.strMeal}`] === 'none') {
                          setSelectMenuSection({ ...selectMenuSection, [`${recipe.strMeal}`]: 'flex' });
                        } else {
                          setSelectMenuSection({ ...selectMenuSection, [`${recipe.strMeal}`]: 'none' });
                        }
                      }}
                    >
                      +
                    </Text>
                    <View style={{ display: selectMenuSection ? selectMenuSection[`${recipe.strMeal}`] : 'none' }}>
                      <Text>Breakfast</Text>
                      <Text>Lunch</Text>
                      <Text>Dinner</Text>
                    </View>
                  </View>
                </View>
              ))}
              </View>
            </ScrollView>
          </View>
          <View>
            <Text />
            <View />
          </View>
        </View>
        <Text style={{
          position: 'absolute', bottom: 0, height: 60, backgroundColor: 'black', color: 'white', width, textAlign: 'center', lineHeight: 60, fontSize: 20,
        }}
        >
          Create menu
        </Text>
      </View>
    </>
  );
};

function mapStateToProps({ userReducer }
    : { userReducer: Object}) {
  return {
    user: userReducer.user,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    actions: bindActionCreators({
      isUserSelectingMenu,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectMenu);
