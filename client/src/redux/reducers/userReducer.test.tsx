import reducer from './userReducer';
import actionTypes from '../actions/actionTypes';

describe('searchReducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'string', user: false })).toEqual(false);
  });

  it('should handle USER_IS_LOGGED_IN', () => {
    expect(
      reducer(false, {
        type: actionTypes.USER_IS_LOGGED_IN,
        user: true,
      }),
    ).toEqual(true);
  });
});
