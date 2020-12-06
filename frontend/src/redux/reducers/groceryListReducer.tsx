export default function groceryListReducer(state: object[] = [], action
    : { type: string; product?: Object, productName?: string }) {
  switch (action.type) {
    case 'GET_PRODUCT_TYPE':
      return [...state, action.product?.[0]];
    case 'DELETE_PRODUCT':
      return state.filter((productItem: Object) => productItem.product !== action.productName);
    case 'DELETE_ALL_PRODUCTS':
      return [];
    default:
      return state;
  }
}
