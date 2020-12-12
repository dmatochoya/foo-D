// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, StatusBar, Image, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import {
  restoreSearchReducer,
  getCategoryRecipesFromAPI, restoreCategoryRecipeByNameReducer, restoreCategoryRecipesReducer,
} from '../../redux/actions/recipesActions';
import SearchBoxInput from './TextInput';

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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  categoriesSectionWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 5,
    marginBottom: 160,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 15,
    color: 'black',
  },
  categoryWrapper: {
    width: '50%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 1,
  },
  categoryContainer: {
    elevation: 10,
    width: 180,
    height: 105,
    marginTop: 13,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 20,
    position: 'relative',
    top: 15,
    color: 'rgb(44, 42, 40)',
  },
  categoryImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    resizeMode: 'contain',
    position: 'relative',
    top: 1,
  },
});

interface Category {
  strCategory: string
  strCategoryThumb: string
}

interface Categories {
  categories: Category[]
}

interface Navigation {
  navigate(route: string, data: object): void
}

interface Actions {
  restoreSearchReducer(): void
  getCategoryRecipesFromAPI(text: string): void
  restoreCategoryRecipeByNameReducer(): void
  restoreCategoryRecipesReducer(): void
}

interface Props {
  categories: Categories
  actions: Actions
  navigation: Navigation
}

function Search({ categories, actions, navigation } : Props) {
  const searchBoxRef = useRef();
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    setNoResults(false);
  }, [noResults]);

  return (
    <View style={{ marginTop: StatusBar.currentHeight }} testID="searchComponent">
      <StatusBar backgroundColor="black" barStyle="light-content" translucent />
      <View style={styles.header}>
        <Text style={{ color: 'white', fontSize: 25, paddingVertical: 10 }}>
          Search
        </Text>
        <View style={styles.searchBox}>
          <Icon size={30} name="ios-search" type="ionicon" onPress={() => searchBoxRef.current.focus()} testID="searchIcon" />
          <SearchBoxInput
            searchBoxRef={searchBoxRef}
            navigation={navigation}
            noResults={noResults}
          />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          Categories
        </Text>
        <View
          onTouchStart={() => searchBoxRef.current.blur()}
          style={styles.categoriesSectionWrapper}
          testID="categoriesSectionWrapper"
        >
          {categories?.categories.filter((category) => category.strCategory !== 'Goat' && category.strCategory !== 'Side').map((category) => (
            <View
              key={Math.random() * Date.now()}
              style={styles.categoryWrapper}
              onTouchStart={() => {
                actions.restoreCategoryRecipeByNameReducer();
                actions.restoreCategoryRecipesReducer();
              }}
              onTouchEnd={() => {
                setNoResults(true);
                actions.getCategoryRecipesFromAPI(category.strCategory);
                navigation.navigate('category', {
                  categoryName: category.strCategory,
                });
              }}
              testID="categoryWrapper"
            >
              <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                colors={['rgb(236, 154, 60)', 'rgb(235, 157, 69)']}
                style={styles.categoryContainer}
              >
                <Text style={styles.categoryName}>
                  {category.strCategory.toUpperCase()}
                </Text>
                <Image
                  style={styles.categoryImage}
                  source={{ uri: category.strCategoryThumb }}
                />
              </LinearGradient>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function mapStateToProps({ recipeCategoriesReducer }
  : { recipeCategoriesReducer: object}) {
  return {
    categories: recipeCategoriesReducer,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    actions: bindActionCreators({
      restoreSearchReducer,
      getCategoryRecipesFromAPI,
      restoreCategoryRecipeByNameReducer,
      restoreCategoryRecipesReducer,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
