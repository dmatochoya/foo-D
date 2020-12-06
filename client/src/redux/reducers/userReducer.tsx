export default function userReducer(state = false, action :
    { type: string; user: boolean;}) {
  switch (action.type) {
    case 'USER_IS_LOGGED_IN':
      return action.user;
    default:
      return state;
  }
}
