import * as React from 'react';
import 'react-native';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react-native';
import TextInput from './TextInput';
import { getRecipeByNameFromAPI, restoreSearchReducer } from '../../redux/actions/recipesActions';

jest.mock('../../redux/actions/recipesActions');
const flushPromises = () => new Promise((resolve) => process.nextTick(resolve));

const buildStore = configureStore([thunk]);

describe('Search', () => {
  let navigation: object;
  let wrapper: React.FunctionComponent<any>;

  const wrapperFactory = (wrapperInitialState: object) => {
    const store = buildStore(wrapperInitialState);
    store.dispatch = jest.fn();

    return ({ children } : {children: JSX.Element}) => (
      <Provider store={store}>
        {children}
      </Provider>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should change TextInput's value from empty string and, accordingly, onSubmitEdditing, call getRecipeByNameFromAPI", async () => {
    const initialState = { recipeCategoriesReducer: { categories: [{ strCategory: 'pasta' }] }, searchReducer: { name: 'buns', status: 'not found' } };
    wrapper = wrapperFactory(initialState);

    const { getByTestId } = await render(<TextInput navigation={navigation} />, { wrapper });
    await flushPromises();

    jest.useFakeTimers();
    const searchBoxInput = getByTestId('searchBoxInput');
    fireEvent(searchBoxInput, 'onChangeText', 'Buns');
    fireEvent(searchBoxInput, 'onSubmitEditing');
    expect(getRecipeByNameFromAPI).toHaveBeenCalled();
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
    expect(setTimeout).toHaveBeenCalledTimes(1);
  });

  it('should change placeholder text onFocus', () => {
    const initialState = { recipeCategoriesReducer: { categories: [{ strCategory: 'pasta' }] }, searchReducer: { name: 'buns', status: 'not found' } };
    wrapper = wrapperFactory(initialState);

    const { getByTestId } = render(<TextInput navigation={navigation} />, { wrapper });
    const searchBoxInput = getByTestId('searchBoxInput');
    fireEvent(searchBoxInput, 'onFocus');
  });

  it('should change placeholder text to No results when recipes has a length of 2', () => {
    const initialState = { recipeCategoriesReducer: { categories: [{ strCategory: 'pasta' }] }, searchReducer: { name: 'buns', status: 'not found' } };
    wrapper = wrapperFactory(initialState);

    const { getByTestId } = render(<TextInput navigation={navigation} />, { wrapper });
    const searchBoxInput = getByTestId('searchBoxInput');
    fireEvent(searchBoxInput, 'onFocus');
  });

  it('should call restoreSearchReducer when searchReducer has no length', () => {
    const initialState = { recipeCategoriesReducer: { categories: [{ strCategory: 'pasta' }] }, searchReducer: {} };
    wrapper = wrapperFactory(initialState);

    render(<TextInput navigation={navigation} />, { wrapper });

    expect(restoreSearchReducer).toHaveBeenCalled();
  });

  it('should not call getRecipeByNameFromAPI when, onSubmitEditing, text is falsy', () => {
    const initialState = { recipeCategoriesReducer: { categories: [{ strCategory: 'pasta' }] }, searchReducer: {} };
    wrapper = wrapperFactory(initialState);

    const { getByTestId } = render(<TextInput navigation={navigation} />, { wrapper });
    const searchBoxInput = getByTestId('searchBoxInput');
    fireEvent(searchBoxInput, 'onSubmitEditing');

    expect(getRecipeByNameFromAPI).toHaveBeenCalledTimes(0);
  });
});
