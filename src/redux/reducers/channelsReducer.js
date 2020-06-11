import { handleActions } from 'redux-actions';
import { takeAllChannels, takingAllChannelsOnSuccess, takingAllChannelsOnError } from '../actions';

const defaultState = {
  loading: false,
  error: null,
  data: {},
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
  },
  defaultState
);
