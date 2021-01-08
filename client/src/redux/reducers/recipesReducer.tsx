export default function recipesReducer(state = { recipes: [] }, action: { type: string; recipe: Object; }) {
  switch (action.type) {
    case 'GET_RECIPE':
      return { ...state, recipes: [...state.recipes, action.recipe.meals[0]] };
    case 'GET_RECIPE_CATEGORIES':
      return { ...state, recipeCategories: action.categories };
    case 'GET_CATEGORY_RECIPES':
      return { ...state, categoryRecipes: action.categoryRecipes };
    case 'RESTORE_CATEGORY_RECIPES':
      return { ...state, categoryRecipes: {} };
    case 'GET_CATEGORY_RECIPE_BY_NAME':
      return {
        ...state,
        categoryRecipesByName: [...state.categoryRecipesByName, action.recipe?.meals[0]],
      };
    case 'RESTORE_CATEGORY_RECIPE_BY_NAME':
      return { ...state, categoryRecipesByName: [] };
    default:
      return state;
  }
}
