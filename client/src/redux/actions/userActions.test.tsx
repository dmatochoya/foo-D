import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import actionTypes from './actionTypes';
import isUserLoggedIn from './userActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('axios');

describe('userActions', () => {
  let store: Object;

  beforeEach(() => {
    store = mockStore();
  });

  afterEach(() => {
    axios.mockRestore();
  });

  it('should call isUserLoggedIn and modify the store actions accordingly', () => {
    store.dispatch(isUserLoggedIn(false));

    expect(store.getActions()).toEqual([{
      type: actionTypes.USER_IS_LOGGED_IN,
      user: false,
    }]);
  });
});
