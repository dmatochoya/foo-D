interface User {
    ownRecipes: Object[]
}

interface Actions {
    addOwnRecipe(user: Object): void
    isUserSelectingMenu(boolean: boolean): boolean | null | undefined
}

interface Navigation {
    goBack(): void
    navigate(route: string, data?: Object): void
}

export interface Props {
    user: User
    actions: Actions
    navigation: Navigation
}

export interface RecipeSections {
        name: string,
        multiline: boolean,
        numberOfLines: number,
        textInputHeight: number,
        textAlignVertical: 'center' | 'top' | 'auto' | 'bottom' | undefined
}
