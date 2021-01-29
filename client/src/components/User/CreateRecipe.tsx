// @ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  View, BackHandler, Text, StatusBar, TextInput, Dimensions, ScrollView,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Props, RecipeSections } from '../Interfaces/CreateRecipeInterfaces';
import styles from './CreateRecipeStyles';
import { isUserSelectingMenu, addOwnRecipe } from '../../redux/actions/userActions';

const CreateRecipe = ({
  user, actions, navigation,
} : Props) => {
  const { width, height } = Dimensions.get('window');
  const [text, setText] = useState<{[key: string]: string}>({
    title: '', photo: '', ingredients: '', steps: '',
  });
  const [image, setImage] = useState<null | string>(null);

  const mockRecipe = () => {
    const arrayOfIngredientsAndMeasure = text.ingredients.split('.')
      .map((ingredient) => ingredient.split(',').map((item) => item.trim()));
    const recipe: {[key: string]: string | null} = {
      strMeal: text.title, strInstructions: text.steps, strMealThumb: image,
    };

    arrayOfIngredientsAndMeasure.forEach((ingredient, ingredientIndex) => {
      recipe[`strIngredient${ingredientIndex + 1}`] = ingredient[0];
      recipe[`strMeasure${ingredientIndex + 1}`] = ingredient[1];
    });

    actions.addOwnRecipe({ ...user, ownRecipes: [...user.ownRecipes, recipe] });
    setTimeout(() => {
      actions.isUserSelectingMenu(false);
      navigation.goBack();
    }, 500);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const focused = useIsFocused();
  useEffect(() => {
    if (focused) {
      const goBackAndShowNavbar = (): null => {
        actions.isUserSelectingMenu(false);
        return null;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        goBackAndShowNavbar,
      );

      return () => backHandler.remove();
    }
  }, [focused]);

  const recipeSections: RecipeSections[] = [
    {
      name: 'title', multiline: false, numberOfLines: 1, textInputHeight: 40, textAlignVertical: 'center',
    },
    {
      name: 'photo', multiline: false, numberOfLines: 1, textInputHeight: 40, textAlignVertical: 'center',
    },
    {
      name: 'ingredients', multiline: true, numberOfLines: 6, textInputHeight: 75, textAlignVertical: 'top',
    },
    {
      name: 'steps', multiline: true, numberOfLines: 6, textInputHeight: 110, textAlignVertical: 'top',
    },
  ];

  return (
    <>
      <StatusBar backgroundColor="black" barStyle="light-content" translucent />
      <View style={{ height }}>
        <Text style={styles.sectionTitle}>My recipe</Text>
        <ScrollView style={{ marginBottom: 50 }}>
          <View style={{ paddingBottom: 10 }}>
            {recipeSections.map((section) => (
              <View key={Math.random() * Date.now()}>
                <Text style={styles.recipeSectionTitle}>
                  {section.name.toUpperCase()}
                </Text>
                {section.name !== 'photo'
                  ? (
                    <View style={{ alignItems: 'center' }}>
                      <TextInput
                        style={[styles.textInput, {
                          height: section.textInputHeight,
                          textAlignVertical: section.textAlignVertical,
                        }]}
                        placeholder={`Add your recipe's ${section.name}`}
                        onChangeText={(textChange) => setText(
                          { ...text, [section.name]: textChange },
                        )}
                        defaultValue={text[section.name]}
                        multiline={section.multiline}
                        numberOfLines={section.numberOfLines}
                      />
                    </View>
                  )
                  : (
                    <View style={styles.photoSectionWrapper}>
                      <View style={styles.photoSectionContainer}>
                        {!image
                          ? (
                            <>
                              <Text style={{ fontSize: 17, color: 'rgba(0, 0, 0, 0.4)', marginRight: 7 }}>
                                Add your recipe's photo:
                              </Text>
                              <Icon size={30} name="md-photos" type="ionicon" onPress={() => pickImage()} />
                            </>
                          )
                          : (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon
                                  size={30}
                                  name="md-image"
                                  color="rgb(43, 102, 237)"
                                  type="ionicon"
                                  onPress={() => navigation.navigate('recipeImage', { image })}
                                />
                                <Text
                                  style={styles.photoFileName}
                                  onPress={() => navigation.navigate('recipeImage', { image })}
                                >
                                  {image.slice(-20)}
                                </Text>
                              </View>
                              <Icon
                                size={30}
                                name="md-trash"
                                type="ionicon"
                                onPress={() => setImage(null)}
                              />
                            </View>
                          )}
                      </View>
                    </View>
                  )}
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={{ position: 'absolute', bottom: 0 }}>
          <Text
            style={[styles.createRecipeButton, { width }]}
            onPress={() => {
              mockRecipe();
            }}
          >
            Create recipe
          </Text>
        </View>
      </View>
    </>
  );
};

function mapStateToProps({ userReducer }
    : { userReducer: {user: Object}}) {
  return {
    user: userReducer.user,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    actions: bindActionCreators({
      isUserSelectingMenu,
      addOwnRecipe,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRecipe);
