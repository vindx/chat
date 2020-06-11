import { createAction } from 'redux-actions';

export const loadDarkThemeAction = createAction('LOAD_DARK_THEME');
export const changeUserTheme = createAction('CHANGE_USER_THEME');
export const setDarkThemeAction = createAction('SET_DARK_THEME', (boolean) => boolean);

export const searchMessages = createAction('SEARCH_MESSAGES');

export const takeAllChannels = createAction('TAKE_ALL_CHANNELS');
export const takingAllChannelsOnSuccess = createAction('TAKE_ALL_CHANNELS_SUCCESS', (data) => data);
export const takingAllChannelsOnError = createAction('TAKE_ALL_CHANNELS_ERROR', (error) => error);
export const addChannel = createAction('ADD_CHANNEL', (channel) => channel);
