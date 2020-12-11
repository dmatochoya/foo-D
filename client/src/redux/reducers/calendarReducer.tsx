export default function calendarReducer(state = {}, action :
    { type: string; load: boolean;}) {
  switch (action.type) {
    case 'LOAD_CALENDAR_INITIALLY':
      console.log('epaentroooo');
      return { ...state, loaded: action.load };
    default:
      return state;
  }
}
