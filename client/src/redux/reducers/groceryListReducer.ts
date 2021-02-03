// @ts-nocheck
interface IObjectKeys {
  [key: string]: string | number | boolean | Object;
}

interface Product extends IObjectKeys {
  product: string | Object[]
  crossedOver: boolean
  name: string
}

interface ProductFound {
  amount?: number
}

export default function groceryListReducer(state: Product[] = [], action
    : { type: string; product: Product; productName?: string }) {
  let productFound: ProductFound | undefined;
  switch (action.type) {
    case 'GET_PRODUCT_TYPE':
      productFound = state.find((product) => product.product === action.product[0].product);
      return productFound
        ? [...state.map((product) => (product !== productFound
          ? product
          : { ...productFound, amount: productFound.amount + 1 }))]
        : [...state, action.product?.[0]];
    case 'DELETE_PRODUCT':
      return state.filter((productItem) => productItem.product !== action.productName);
    case 'CROSS_OVER_PRODUCT':
      return state.map((product) => (product.product === action.product.name
        ? { ...product, isCrossed: action.product.crossedOver }
        : product));
    case 'DELETE_ALL_PRODUCTS':
      return [];
    default:
      return state;
  }
}
