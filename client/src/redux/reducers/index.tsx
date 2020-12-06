/* istanbul ignore file */
import { combineReducers } from 'redux';
import recipesReducer from './recipesReducer';
import searchReducer from './searchReducer';
import recipeCategoriesReducer from './recipeCategoriesReducer';
import categoryRecipesReducer from './categoryRecipesReducer';
import categoryRecipesByNameReducer from './categoryRecipesByNameReducer';
import groceryListReducer from './groceryListReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  recipesReducer,
  searchReducer,
  recipeCategoriesReducer,
  categoryRecipesReducer,
  categoryRecipesByNameReducer,
  groceryListReducer,
  userReducer,
});

export default rootReducer;
