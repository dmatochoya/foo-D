import reducer from './recipeCategoriesReducer';
import actionTypes from '../actions/actionTypes';

describe('recipeCategoriesReducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'string', categories: {} })).toEqual({});
  });

  it('should handle GET_RECIPE_CATEGORIES', () => {
    expect(
      reducer({}, {
        type: actionTypes.GET_RECIPE_CATEGORIES,
        categories: { name: 'Dessert', recipes: [{}] },
      }),
    ).toEqual(
      { name: 'Dessert', recipes: [{}] },
    );
  });
});
