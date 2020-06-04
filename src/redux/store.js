import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import combinedReducers from './reducers';
import watchers from './sagas';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = compose(applyMiddleware(sagaMiddleware));

export default createStore(combinedReducers, composeEnhancers);
sagaMiddleware.run(watchers);
