import React, { useEffect } from 'react';
import {
  View, Text, StatusBar, StyleSheet, Dimensions,
  Image, TouchableWithoutFeedback, ActivityIndicator, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { getRecipeByNameFromAPI } from '../../redux/actions/recipesActions';

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    width: '100%',
    height: 50,
    backgroundColor: 'rgb(230, 84, 84)',
    paddingHorizontal: 10,
    justifyContent: 'center',
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
});

interface Recipe {
    strMeal: string
}

interface RecipeList {
    meals: Recipe[]
}

interface CategoryRecipe {
    strMealThumb: string
    strMeal: string
}

interface Navigation {
    navigate(route: string, data: object): void
}

interface Actions {
    getRecipeByNameFromAPI(text : string, boolean: boolean): void
  }

interface Props {
    recipes: RecipeList
    categoryRecipes: CategoryRecipe[]
    actions: Actions
    navigation: Navigation
    route: { params: { categoryName: string } }
}

let categoryRecipeIndex: number = 0;

function Category({
  recipes, categoryRecipes, actions, navigation, route: { params: { categoryName } },
} : Props) {
  const { height } = Dimensions.get('window');
  const recipePhotoHeight = +(height - 114).toFixed();
  const linearGradientBoxHeight = height - 280;

  let scrollViewContentOffsetY = 0;
  let goingDown: boolean;

  let recipePhotoUri: string;
  let recipeName: string;
  const getRecipeNameAndPhoto = (index: number) => {
    recipePhotoUri = categoryRecipes[index].strMealThumb;
    recipeName = categoryRecipes[index].strMeal;
  };

  const recipesJSX: JSX.Element[] = [];
  const addRecipeToScrollView = (index: number) => {
    getRecipeNameAndPhoto(index);
    recipesJSX.push(
      <TouchableWithoutFeedback
        key={Math.random() * Date.now()}
        onPress={() => {
          navigation.navigate('detail', {
            recipe: categoryRecipes[index],
          });
        }}
      >
        <View>
          <Image
            style={{ height: recipePhotoHeight, position: 'relative', top: 50 }}
            source={{ uri: recipePhotoUri }}
          />
          <LinearGradient
            colors={['transparent', 'rgb(250, 250, 250)']}
            style={[styles.linearGradientBox, { top: linearGradientBoxHeight }]}
          >
            <Text style={styles.recipeName}>
              {recipeName}
            </Text>
          </LinearGradient>
        </View>
      </TouchableWithoutFeedback>,
    );
  };

  if (categoryRecipes.length >= 3) {
    categoryRecipes.forEach((element: object, index: number) => {
      addRecipeToScrollView(index);
    });
  }
  useEffect(() => {
    if (Object.keys(recipes).length) {
      for (categoryRecipeIndex = 0; categoryRecipeIndex < 3; categoryRecipeIndex += 1) {
        actions.getRecipeByNameFromAPI(recipes.meals[categoryRecipeIndex].strMeal, true);
      }
    }
  }, [Object.keys(recipes).length]);

  return (
    <View style={{ marginTop: StatusBar.currentHeight }}>
      <StatusBar backgroundColor="black" barStyle="light-content" translucent />
      <View style={styles.header}>
        <Text style={{ color: 'white', fontSize: 25 }}>
          {`${categoryName} category`}
        </Text>
      </View>
      <ScrollView
        pagingEnabled
        decelerationRate={0}
        snapToInterval={recipePhotoHeight}
        snapToAlignment="center"
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          if (event.nativeEvent.contentOffset.y > scrollViewContentOffsetY) {
            goingDown = true;
          } else {
            goingDown = false;
          }
          scrollViewContentOffsetY = event.nativeEvent.contentOffset.y;
        }}
        onScrollEndDrag={() => {
          if (goingDown) {
            if (recipes.meals.length <= categoryRecipeIndex) {
              categoryRecipeIndex = 0;
            }
            actions.getRecipeByNameFromAPI(recipes.meals[categoryRecipeIndex].strMeal, true);
            categoryRecipeIndex += 1;
          }
        }}
      >
        {recipesJSX.length ? recipesJSX : <ActivityIndicator color="black" style={{ marginTop: height / 2 - 30 }} size={60} />}
      </ScrollView>
    </View>
  );
}

function mapStateToProps({ categoryRecipesReducer, categoryRecipesByNameReducer }
    : { categoryRecipesReducer: object, categoryRecipesByNameReducer : object}) {
  return {
    recipes: categoryRecipesReducer,
    categoryRecipes: categoryRecipesByNameReducer,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    actions: bindActionCreators({ getRecipeByNameFromAPI }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Category);
