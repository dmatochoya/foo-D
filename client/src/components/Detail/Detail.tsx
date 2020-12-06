import React, { useState, useRef, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  Dimensions, Text, ScrollView, View, StatusBar, Image, StyleSheet, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    marginTop: StatusBar.currentHeight,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgb(230, 84, 84)',
    paddingHorizontal: 15,
  },
  linearGradientBox: {
    position: 'absolute',
    backgroundColor: ' rgba(250, 250, 250, 0.4)',
    width: '100%',
    height: 240,
    alignItems: 'center',
    padding: 10,
  },
  recipeName: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    textShadowColor: 'rgba(250, 250, 250, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 15,
  },
  ingredientContainer: {
    height: 100,
    width: 100,
    backgroundColor: 'rgb(23, 153, 158)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  stepCard: {
    alignSelf: 'center',
    height: 180,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: '#FFF',
    elevation: 10,
    justifyContent: 'center',
    padding: 15,
  },
});

interface Recipe {
  [key: string] : string
}

interface Props {
  route: { params: { recipe: Recipe } }
  navigation: { goBack(): void }
}

export default function Detail({
  route: { params: { recipe } },
  navigation: { goBack },
}
  : Props) {
  const { height, width } = Dimensions.get('window');
  const recipeStepWidth = +(width - width * 10 / 100).toFixed();
  const linearGradientBoxHeight = height - 280;

  const [heartIconPressed, setHeartIconPressed] = useState(false);
  const scrollRef = useRef(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
  }, [isFocused]);

  let recipePhotoUri;
  let recipeName;
  const getRecipeNameAndPhoto = () => {
    recipePhotoUri = recipe.strMealThumb;
    recipeName = recipe.strMeal;
  };

  const ingredientsJSX: JSX.Element[] = [];
  const addIngredientsAndMeasure = () => {
    for (let i = 1; i < 21; i += 1) {
      const ingredientName = recipe[`strIngredient${i}`];
      const ingredientMeasure = recipe[`strMeasure${i}`];
      if (ingredientName) {
        ingredientsJSX.push(
          <View key={i} style={{ alignItems: 'center', width: '33%', marginBottom: 15 }}>
            <View style={styles.ingredientContainer}>
              <Image
                style={{
                  height: 75, width: 75,
                }}
                source={{ uri: `https://www.themealdb.com/images/ingredients/${ingredientName}.png` }}
              />
            </View>
            <Text style={{ width: '90%', textAlign: 'center' }}>
              {
              !ingredientName.includes(' ') && ingredientName.includes('-')
                ? ingredientName.replace('-', '- ')
                : ingredientName
              }
              {`\n ${ingredientMeasure}`}
            </Text>
          </View>,
        );
      }
    }
  };

  const stepsJSX: JSX.Element[] = [];
  const arrayOfSteps: String[] = [];

  const divideLengthyStepStrings = (string: string) => {
    const indexOfPoint = string.indexOf('. ', 100);
    if (indexOfPoint !== -1) {
      arrayOfSteps.push(string.substring(0, indexOfPoint + 1));
      const remainingStepString = string.substring(indexOfPoint + 2);
      if (remainingStepString.length > 100) {
        divideLengthyStepStrings(remainingStepString);
      }
    } else {
      arrayOfSteps.push(string);
    }
  };

  const checkForLengthyStepStrings = () => {
    recipe!.strInstructions!.match!(/[^\r\n]+/g)!.forEach((string) => {
      if (string.length > 100) {
        divideLengthyStepStrings(string);
      } else if (string.length > 1) {
        arrayOfSteps.push(string);
      }
    });
  };

  const addRecipeSteps = () => {
    checkForLengthyStepStrings();

    arrayOfSteps.forEach((step, stepNumber) => {
      let marginLeft = 10;
      let marginRight = 0;
      if (step === arrayOfSteps[0]) {
        marginLeft = 20;
      } else if (step === arrayOfSteps[arrayOfSteps.length - 1]) {
        marginRight = 20;
      }

      stepsJSX.push(
        <View
          key={Math.random() * Date.now()}
          style={[styles.stepContainer, {
            width: recipeStepWidth, marginLeft, marginRight, position: 'relative',
          }]}
        >
          <View style={[styles.stepCard, { width: recipeStepWidth }]}>
            <Text style={{ textAlign: 'center', fontSize: 17 }}>
              {(typeof +step[0] === 'number' || typeof +`${step[0]}${step[1]}` === 'number') && (step[1] === '.' || step[1] === ')') ? step.substring(2) : step}
            </Text>
            <Text style={{
              position: 'absolute', top: 0, right: 10, textDecorationLine: 'underline',
            }}
            >
              {`${stepNumber + 1}/${arrayOfSteps.length}`}
            </Text>
          </View>
        </View>,
      );
    });
  };

  getRecipeNameAndPhoto();
  addIngredientsAndMeasure();
  addRecipeSteps();

  return (
    <View>
      <StatusBar backgroundColor="black" barStyle="light-content" translucent />
      <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <Ionicons
          size={45}
          style={{ color: 'white' }}
          name="ios-arrow-round-back"
          type="ionicons"
          onPress={() => goBack()}
        />
        <TouchableOpacity onPress={() => setHeartIconPressed(!heartIconPressed)} style={{ alignSelf: 'center' }}>
          <Ionicons
            size={30}
            style={{ color: 'white' }}
            name={heartIconPressed ? 'md-heart' : 'md-heart-empty'}
            type="ionicons"
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ marginBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View>
          <Image style={{ height: height - 40 }} source={{ uri: recipePhotoUri }} />
          <LinearGradient
            colors={['transparent', 'rgb(250, 250, 250)']}
            style={[styles.linearGradientBox, { top: linearGradientBoxHeight }]}
          >
            <Text style={styles.recipeName}>
              {recipeName}
            </Text>
          </LinearGradient>
        </View>
        <View>
          <Text style={styles.sectionTitle}>
            Ingredients
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {ingredientsJSX}
          </View>
        </View>
        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.sectionTitle}>
            Steps
          </Text>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            decelerationRate={0}
            snapToInterval={recipeStepWidth + 10.1}
            snapToAlignment="center"
            showsHorizontalScrollIndicator={false}
          >
            {stepsJSX}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
