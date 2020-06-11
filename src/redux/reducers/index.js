import { combineReducers } from 'redux';

import themeReducer from './themeReducer';
import channelsReducer from './channelsReducer';

export default combineReducers({
  theme: themeReducer,
  channels: channelsReducer,
});
