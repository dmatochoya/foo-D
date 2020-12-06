import reducer from './categoryRecipesByNameReducer';
import actionTypes from '../actions/actionTypes';

describe('categoryRecipesByNameReducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'string', recipe: { meals: [] } })).toEqual([]);
  });

  it('should handle GET_CATEGORY_RECIPE_BY_NAME', () => {
    expect(
      reducer([{ name: 'lasgna', type: 'pasta' }], {
        type: actionTypes.GET_CATEGORY_RECIPE_BY_NAME,
        recipe: { meals: [{ name: 'Arrabiata', type: 'pasta' }] },
      }),
    ).toEqual([{ name: 'lasgna', type: 'pasta' }, { name: 'Arrabiata', type: 'pasta' }]);
  });

  it('should handle RESTORE_CATEGORY_RECIPE_BY_NAME_REDUCER', () => expect(
    reducer([{ name: 'Arrabiata', type: 'pasta' }], {
      type: actionTypes.RESTORE_CATEGORY_RECIPE_BY_NAME_REDUCER,
    }),
  ).toEqual([]));
});
