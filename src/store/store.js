import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from "./../reducers/rootReducer";
import rootSaga from "./../sagas/rootSaga";



const sagaMiddleware = createSagaMiddleware();

let composeEnhancers = compose;
if(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__  && process.env.NODE_ENV === "development"){
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}
const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));
const store = createStore(rootReducer, enhancer);

sagaMiddleware.run(rootSaga);

export default store;