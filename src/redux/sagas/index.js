import { takeLatest, call, put } from 'redux-saga/effects';

import client from '../../apollo';
import { getUserThemeQuery, changeUserThemeMutation } from '../../graphql/user';
import { loadDarkThemeAction, setDarkThemeAction, changeUserTheme } from '../actions';

const fetchDarkTheme = () =>
  client.query({ query: getUserThemeQuery, fetchPolicy: 'network-only' });

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

export default function* watchers() {
  yield takeLatest(loadDarkThemeAction, workerSetDarkTheme);
  yield takeLatest(changeUserTheme, workerChangeUserTheme);
}
