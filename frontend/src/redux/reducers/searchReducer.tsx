export default function searchReducer(state = {}, action :
    { type: string; recipe?: Object; message?: object }) {
  switch (action.type) {
    case 'GET_RECIPE_BY_NAME':
      return action.recipe?.meals[0];
    case 'GET_RECIPE_BY_NAME_ERROR':
      return action.message;
    case 'RESTORE_SEARCH_REDUCER':
      return {};
    default:
      return state;
  }
}
