export interface CalendarDayBackgroundColor {
  [key: string]: string
}

export interface Days {
  day: number
  month: string
}

export interface Week {
  firstDay: number
  lastDay: number
  daysArray: Days[]
}

interface Menu {
  [key: string]: string
}

interface User {
  menus: Menu[]
}

interface Actions {
  isUserSelectingMenu(boolean: boolean): void
}

interface Navigation {
  navigate(route: string, date: object): void
}

export interface UserReducer {
  user: Object
}

export interface Props {
    user: User,
    actions: Actions,
    navigation: Navigation
}
