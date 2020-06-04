import { handleActions } from 'redux-actions';
import { setDarkThemeAction } from '../actions';

const defaultState = {
  loaded: false,
  darkTheme: false,
};

export default handleActions(
  {
    [setDarkThemeAction]: (state, action) => ({
      ...state,
      loaded: true,
      darkTheme: action.payload,
    }),
  },
  defaultState
);
