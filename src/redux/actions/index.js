import { createAction } from 'redux-actions';

export const loadDarkThemeAction = createAction('LOAD_DARK_THEME');
export const changeUserTheme = createAction('CHANGE_USER_THEME');
export const setDarkThemeAction = createAction('SET_DARK_THEME', (boolean) => boolean);
