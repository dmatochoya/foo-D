import React, { useEffect } from 'react';
import {
  View, Text, StatusBar, StyleSheet, Dimensions, Image, TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { ScrollView } from 'react-native-gesture-handler';
import { getRecipeFromAPI } from '../../redux/actions/recipesActions';

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
    strMealThumb: string
    strMeal: string
}

interface Navigation {
    navigate(route: string, data: object): void
}

interface Props {
    recipes: Array<Recipe>
    actions: object
    navigation: Navigation
}

function Home({ recipes, actions, navigation }: Props) {
  const { height } = Dimensions.get('window');
  const recipePhotoHeight = +(height - 114).toFixed();
  const linearGradientBoxHeight = height - 280;

  let scrollViewContentOffsetY = 0;
  let goingDown: boolean;

  let recipePhotoUri: string;
  let recipeName : string;
  const getRecipeNameAndPhoto = (index: number) => {
    recipePhotoUri = recipes[index].strMealThumb;
    recipeName = recipes[index].strMeal;
  };

  const recipesJSX: JSX.Element[] = [];
  const addRecipeToScrollView = (index: number) => {
    getRecipeNameAndPhoto(index);
    recipesJSX.push(
      <TouchableWithoutFeedback
        key={Math.random() * Date.now()}
        onPress={() => navigation.navigate('detail', {
          recipe: recipes[index],
        })}
      >
        <View testID="recipeTest">
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

  if (recipes?.length) {
    recipes?.forEach((element: object, index: number) => {
      addRecipeToScrollView(index);
    });
  }

  useEffect(() => {
    if (!recipes.length) {
      for (let i = 0; i < 3; i += 1) {
        actions.getRecipeFromAPI();
      }
    }
  }, []);

  return (
    <View style={{ marginTop: StatusBar.currentHeight }} testID="test">
      <StatusBar backgroundColor="black" barStyle="light-content" translucent />
      <View style={styles.header}>
        <Text style={{ color: 'white', fontSize: 25 }}>
          Recipes
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
            actions.getRecipeFromAPI();
          }
        }}
      >
        {recipesJSX}
      </ScrollView>
    </View>
  );
}

function mapStateToProps({ recipesReducer } : { recipesReducer: object}) {
  return {
    recipes: recipesReducer,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    actions: bindActionCreators({ getRecipeFromAPI }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
