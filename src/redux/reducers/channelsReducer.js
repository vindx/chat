import { handleActions } from 'redux-actions';
import {
  takeAllChannels,
  takingAllChannelsOnSuccess,
  takingAllChannelsOnError,
  addChannel,
} from '../actions';

const defaultState = {
  loading: false,
  error: null,
  data: [],
};

export default handleActions(
  {
    [takeAllChannels]: (state) => ({
      ...state,
      loading: true,
    }),
    [takingAllChannelsOnSuccess]: (state, action) => ({
      ...state,
      loading: false,
      error: null,
      data: action.payload,
    }),
    [takingAllChannelsOnError]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
    [addChannel]: (state, action) => ({
      ...state,
      data: [...state.data, action.payload],
    }),
  },
  defaultState
);
