import actionTypes from './actionTypes';

export default function isUserLoggedIn(user: boolean) {
  return {
    type: actionTypes.USER_IS_LOGGED_IN,
    user,
  };
}
