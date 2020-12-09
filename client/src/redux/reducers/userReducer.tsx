export default function userReducer(state = {}, action :
    { type: string; user: boolean;}) {
  switch (action.type) {
    case 'USER_IS_LOGGED_IN':
      return { ...state, isUserLoggedIn: action.user };
    case 'GET_USER':
      return { ...state, user: action.user };
    case 'ADD_OR_REMOVE_FAVORITE_RECIPE':
      return { ...state, user: action.user };
    case 'UPDATE_USER_GROCERY_LIST':
      return { ...state, user: action.user };
    default:
      return state;
  }
}
