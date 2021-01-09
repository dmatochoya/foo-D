import { combineReducers } from 'redux';
import recipesReducer from './recipesReducer';
import searchReducer from './searchReducer';
import groceryListReducer from './groceryListReducer';
import userReducer from './userReducer';
import calendarReducer from './calendarReducer';

const rootReducer = combineReducers({
  recipesReducer,
  searchReducer,
  groceryListReducer,
  userReducer,
  calendarReducer,
});

export default rootReducer;
