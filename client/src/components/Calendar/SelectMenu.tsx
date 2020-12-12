// @ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, BackHandler, Text, StatusBar, Image, Dimensions, ScrollView, Button,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { isUserSelectingMenu } from '../../redux/actions/userActions';
import postMenu from '../../redux/actions/calendarActions';
import { navigationRef } from '../../../RootNavigation';

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

interface Props {
    user: Object
    route: Object
    actions: Object
    navigation: Object
}

const SelectMenu = ({
  user, route: { params: { date } }, actions, navigation,
} : Props) => {
  const { width, height } = Dimensions.get('window');
  const [selectMenuSection, setSelectMenuSection] = useState<Object>();

  const selectMenuSectionObject: Object = {};

  user.favoriteRecipes.forEach((recipe: Object) => {
    selectMenuSectionObject[`${recipe.strMeal}`] = { displayDropDown: 'none', addedTo: '' };
  });

  useEffect(() => {
    setSelectMenuSection(selectMenuSectionObject);
  }, []);

  useEffect(() => {
    const goBackAndShowNavbar = (): boolean | null | undefined => {
      actions.isUserSelectingMenu(false);
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      goBackAndShowNavbar,
    );

    return () => backHandler.remove();
  }, []);

  const dateArray = date.split('');
  dateArray.splice(date.split('').findIndex((character: string) => !Number.isNaN(+character)), 0, ' ');

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
                {user.favoriteRecipes.length && user.favoriteRecipes.map((recipe: Object) => (
                  <View style={[styles.favoriteCard, { flexDirection: 'row', width: width - 30, position: 'relative' }]}>
                    {selectMenuSection && selectMenuSection[`${recipe.strMeal}`].addedTo
                      ? (
                        <View style={{
                          zIndex: 1,
                          backgroundColor: 'rgba(0, 0, 0, 0.55)',
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          borderRadius: 5,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        >
                          <View
                            style={{
                              position: 'absolute', top: 5, left: 5, backgroundColor: 'rgb(225, 225, 225)', height: 25, width: 25, borderRadius: 25, borderColor: 'black', borderWidth: 0.5, zIndex: 3,
                            }}
                          >
                            <Icon
                              onPress={() => setSelectMenuSection({ ...selectMenuSection, [`${recipe.strMeal}`]: { ...selectMenuSection[`${recipe.strMeal}`], addedTo: '' } })}
                              size={23}
                              color="black"
                              name="md-close"
                              type="ionicon"
                            />
                          </View>
                          <Text style={{ color: 'white', fontSize: 35 }}>{selectMenuSection[`${recipe.strMeal}`].addedTo}</Text>
                        </View>
                      )
                      : null}
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
                      position: 'absolute', top: 5, left: 5, flexDirection: 'row',
                    }}
                    >
                      <Text
                        style={{
                          display: selectMenuSection && selectMenuSection[`${recipe.strMeal}`].addedTo ? 'none' : 'flex',
                          fontSize: 35,
                          fontFamily: 'serif',
                          backgroundColor: 'white',
                          height: 25,
                          width: 25,
                          lineHeight: 33,
                          borderRadius: 25,
                          textAlign: 'center',
                          borderColor: 'black',
                          borderWidth: 0.5,
                          zIndex: 1,
                        }}
                        onPress={() => {
                          if (selectMenuSection[`${recipe.strMeal}`].displayDropDown === 'none') {
                            setSelectMenuSection({ ...selectMenuSection, [`${recipe.strMeal}`]: { ...selectMenuSection[`${recipe.strMeal}`], displayDropDown: 'flex' } });
                          } else {
                            setSelectMenuSection({ ...selectMenuSection, [`${recipe.strMeal}`]: { ...selectMenuSection[`${recipe.strMeal}`], displayDropDown: 'none' } });
                          }
                        }}
                      >
                        +
                      </Text>
                      <View style={{
                        display: selectMenuSection ? selectMenuSection[`${recipe.strMeal}`].displayDropDown : 'none', backgroundColor: 'rgba(250, 250, 250, 0.9)', position: 'relative', top: -9, right: 11.5, width: 110, borderRadius: 8, alignItems: 'center', borderColor: 'black', borderWidth: 0.5,
                      }}
                      >
                        <Text
                          style={{
                            fontSize: 17, paddingVertical: 6, textAlign: 'center', borderBottomColor: 'black', borderBottomWidth: 1, width: '80%',
                          }}
                          onPress={() => setSelectMenuSection({ ...selectMenuSection, [`${recipe.strMeal}`]: { displayDropDown: 'none', addedTo: 'Breakfast' } })}
                        >
                          Breakfast
                        </Text>
                        <Text
                          style={{
                            fontSize: 17, paddingVertical: 6, textAlign: 'center', borderBottomColor: 'black', borderBottomWidth: 1, width: '80%',
                          }}
                          onPress={() => setSelectMenuSection({ ...selectMenuSection, [`${recipe.strMeal}`]: { displayDropDown: 'none', addedTo: 'Lunch' } })}

                        >
                          Lunch
                        </Text>
                        <Text
                          style={{ fontSize: 17, paddingVertical: 6, textAlign: 'center' }}
                          onPress={() => setSelectMenuSection({ ...selectMenuSection, [`${recipe.strMeal}`]: { displayDropDown: 'none', addedTo: 'Dinner' } })}
                        >
                          Dinner
                        </Text>
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
        <Text
          style={{
            position: 'absolute', bottom: 0, height: 60, backgroundColor: 'black', color: 'white', width, textAlign: 'center', lineHeight: 60, fontSize: 20,
          }}
          onPress={() => {
            Object.keys(selectMenuSection)
              .forEach((recipe) => delete selectMenuSection[recipe].displayDropDown);

            user.menus = [...user.menus, { [date]: selectMenuSection }];
            actions.postMenu(user);

            Object.keys(selectMenuSection)
              .forEach((recipe) => { selectMenuSection[recipe].displayDropDown = 'none'; });

            setTimeout(() => {
              actions.isUserSelectingMenu(false);
              navigation.navigate('calendar');
            }, 500);
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
      postMenu,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectMenu);
