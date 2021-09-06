import { createStore, combineReducers, applyMiddleware, compose  } from 'redux';
import thunk from 'redux-thunk';
import { loginReducer } from '../reducer/authReducer';
import { leadsReducer } from '../reducer/leadsReducer';
import { salesReducer } from '../reducer/salesReducer';

const rootReducer = combineReducers({
    loginReducer: loginReducer,
    leadsReducer: leadsReducer,
    salesReducer: salesReducer
});

export const store = compose(applyMiddleware(thunk))(createStore)(rootReducer);