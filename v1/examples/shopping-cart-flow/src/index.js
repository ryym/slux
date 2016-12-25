// @flow

// import 'babel-polyfill';  XXX: wny error on flow?

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'slux/react';
import { dispatcher, commands } from './dispatcher';
import App from './components/App';

// import store from './stores/root'
// store.onMutation((s, commit) => {
//   console.log(commit)
// })

// XXX tmp

import { TypedStore } from 'slux'
import type { GetterCreator, GetterCreators, GetterContext } from 'slux'

type Getters = {
  getA: GetA
}

type MyStore = TypedStore<any, Getters, any, any>

type State = any

type Getter<F> = GetterCreator<State, Getters, F>

type GetA = (n: number) => bool
const getA: Getter<GetA> = (c) => (n) => {
  return n > 0
}

// XXX: 余計な関数を入れるとエラーになるけど、Gettersの関数が足りなくてもエラーにならない。
const getters: GetterCreators<State, Getters> = {
  getA
}

const store: MyStore = new TypedStore({
  getters
})

dispatcher.dispatch(commands.loadProducts());

ReactDOM.render(
  <Provider dispatcher={dispatcher}>
    <App />
  </Provider>,
  document.getElementById('root')
);


