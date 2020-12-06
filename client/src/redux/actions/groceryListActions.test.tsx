import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import actionTypes from './actionTypes';
import * as actions from './groceryListActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('axios');

describe('groceryListActions', () => {
  let store: Object;

  beforeEach(() => {
    store = mockStore();
  });

  afterEach(() => {
    axios.mockRestore();
  });

  it('should call getProductTypeFromFoodDB and modify the store actions on resolve accordingly with data being an empty array', async () => {
    const product = 'lasagna';
    const response = {
      data: [],
    };

    axios.get.mockImplementationOnce(() => Promise.resolve(response));
    await store.dispatch(actions.getProductTypeFromFoodDB(product));

    expect(store.getActions()).toEqual([{
      type: actionTypes.GET_PRODUCT_TYPE,
      product: [{ product, type: 'uncategorized' }],
    }]);
  });

  it('should call getProductTypeFromFoodDB and modify the store actions on resolve accordingly with data being an array with content', async () => {
    const product = 'lasagna';
    const response = {
      data: [{ product, type: 'pasta' }],
    };

    axios.get.mockImplementationOnce(() => Promise.resolve(response));
    await store.dispatch(actions.getProductTypeFromFoodDB(product));

    expect(store.getActions()).toEqual([{
      type: actionTypes.GET_PRODUCT_TYPE,
      product: [{ product, type: 'pasta' }],
    }]);
  });

  it('should call getProductTypeFromFoodDB and, on reject, call console.log', async () => {
    const product = 'lasagna';
    const error = 'Mock error';
    jest.spyOn(global.console, 'log');

    axios.get.mockImplementationOnce(() => Promise.reject(error));
    await store.dispatch(actions.getProductTypeFromFoodDB(product));

    expect(console.log).toHaveBeenCalled();
  });

  it('should call deleteAllProductsFromGorceryList and modify the store actions accordingly', () => {
    store.dispatch(actions.deleteAllProductsFromGorceryList());

    expect(store.getActions()).toEqual([{
      type: actionTypes.DELETE_ALL_PRODUCTS,
    }]);
  });

  it('should call deleteProductFromGorceryList and modify the store actions accordingly', () => {
    const productName = 'apple';

    store.dispatch(actions.deleteProductFromGorceryList(productName));

    expect(store.getActions()).toEqual([{
      type: actionTypes.DELETE_PRODUCT,
      productName,
    }]);
  });
});
