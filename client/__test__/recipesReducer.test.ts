import reducer from '../src/redux/reducers/recipesReducer';
import actionTypes from '../src/redux/actions/actionTypes';

describe('recipesReducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {
      type: 'string', recipe: { meals: [] }, categories: {}, categoryRecipes: {},
    })).toEqual({ categoryRecipesByName: [], recipes: [] });
  });

  it('should handle GET_RECIPE', () => {
    expect(
      reducer({ recipes: [], categoryRecipesByName: [] }, {
        type: actionTypes.GET_RECIPE,
        recipe: { meals: ['Arrabiata'] },
      }),
    ).toEqual({
      categoryRecipesByName: [],
      recipes: ['Arrabiata'],
    });
  });

  it('should handle GET_RECIPE_CATEGORIES', () => {
    expect(
      reducer({ recipes: [], categoryRecipesByName: [] }, {
        type: actionTypes.GET_RECIPE_CATEGORIES,
        categories: { name: 'Dessert', recipes: [{}] },
      }),
    ).toEqual({
      recipes: [],
      recipeCategories: {
        name: 'Dessert',
        recipes: [{}],
      },
      categoryRecipesByName: [],
    });
  });

  it('should handle GET_CATEGORY_RECIPES', () => {
    expect(
      reducer({ recipes: [], categoryRecipesByName: [] }, {
        type: actionTypes.GET_CATEGORY_RECIPES,
        categoryRecipes: { name: 'Arrabiata', type: 'pasta' },
      }),
    ).toEqual({
      categoryRecipes: {
        name: 'Arrabiata',
        type: 'pasta',
      },
      categoryRecipesByName: [],
      recipes: [],
    });
  });

  it('should handle RESTORE_CATEGORY_RECIPES', () => {
    expect(
      reducer({ recipes: [], categoryRecipesByName: [], categoryRecipes: { name: 'Arrabiata', type: 'pasta' } }, {
        type: actionTypes.RESTORE_CATEGORY_RECIPES,
      }),
    ).toEqual({ recipes: [], categoryRecipesByName: [], categoryRecipes: {} });
  });

  it('should handle GET_CATEGORY_RECIPE_BY_NAME', () => {
    expect(
      reducer({ recipes: [], categoryRecipesByName: [{ name: 'lasgna', type: 'pasta' }] }, {
        type: actionTypes.GET_CATEGORY_RECIPE_BY_NAME,
        recipe: { meals: [{ name: 'Arrabiata', type: 'pasta' }] },
      }),
    ).toEqual({ recipes: [], categoryRecipesByName: [{ name: 'lasgna', type: 'pasta' }, { name: 'Arrabiata', type: 'pasta' }] });
  });

  it('should handle RESTORE_CATEGORY_RECIPE_BY_NAME', () => expect(
    reducer({ recipes: [], categoryRecipesByName: [{ name: 'lasgna', type: 'pasta' }] }, {
      type: actionTypes.RESTORE_CATEGORY_RECIPE_BY_NAME,
    }),
  ).toEqual({ recipes: [], categoryRecipesByName: [] }));
});
