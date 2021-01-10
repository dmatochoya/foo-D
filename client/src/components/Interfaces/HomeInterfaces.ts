interface Recipe {
    strMealThumb: string
    strMeal: string
}

interface Actions {
    getRecipeFromAPI(): void
    isUserSelectingMenu(boolean: boolean): void
}

interface Navigation {
    navigate(route: string, data: object): void
}

interface Props {
    recipes: Array<Recipe>
    actions: Actions
    navigation: Navigation
}

export default Props;
