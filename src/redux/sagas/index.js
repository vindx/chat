import { takeLatest, call, put } from 'redux-saga/effects';

import client from '../../apollo';
import { getUserThemeQuery, changeUserThemeMutation, getUserQuery } from '../../graphql/user';
import {
  loadDarkThemeAction,
  setDarkThemeAction,
  changeUserTheme,
  searchMessages,
  takeAllChannels,
  takingAllChannelsOnSuccess,
  takingAllChannelsOnError,
} from '../actions';
import { searchMessagesMutation } from '../../graphql/message';
import { allChannelsQuery } from '../../graphql/channel';

const fetchDarkTheme = () =>
  client.query({ query: getUserThemeQuery, fetchPolicy: 'network-only' });

const fetchAllChannels = () =>
  client.query({ query: allChannelsQuery, fetchPolicy: 'network-only' });

const changeThemeMutate = () => client.mutate({ mutation: changeUserThemeMutation });

function* workerSetDarkTheme() {
  const {
    data: {
      getUser: { darkTheme },
    },
  } = yield call(fetchDarkTheme);
  yield put(setDarkThemeAction(darkTheme));
}

function* workerChangeUserTheme() {
  const {
    data: { changeTheme },
  } = yield call(changeThemeMutate);
  yield put(setDarkThemeAction(changeTheme));
}

function* workerSearchMessages({ payload }) {
  const { userId, text } = payload;
  yield client.mutate({
    mutation: searchMessagesMutation,
    variables: { text },
    update: (store, { data: { findMessages } }) => {
      let data = store.readQuery({ query: getUserQuery, variables: { id: userId } });
      data = { ...data, getUser: { ...data.getUser, messages: findMessages } };
      store.writeQuery({ query: getUserQuery, variables: { id: userId }, data });
    },
  });
}

function* workerTakeAllChannels() {
  const data = yield call(fetchAllChannels);
  if (data.error) {
    yield put(takingAllChannelsOnError(data.error));
  } else {
    yield put(takingAllChannelsOnSuccess(data.data));
  }
}

export default function* watchers() {
  yield takeLatest(loadDarkThemeAction, workerSetDarkTheme);
  yield takeLatest(changeUserTheme, workerChangeUserTheme);
  yield takeLatest(searchMessages, workerSearchMessages);
  yield takeLatest(takeAllChannels, workerTakeAllChannels);
}
