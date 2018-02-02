import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from 'redux-form';
import React from 'react';
import Decorator from './decorator';

const store = createStore(combineReducers({
    form: reducer
    /*  eslint no-underscore-dangle:0   */
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export function reduxDecorator(story) {
    return (
        <Provider store={store}>
            {Decorator(story)}
        </Provider>
    );
}
