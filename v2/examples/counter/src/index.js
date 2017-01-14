import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './components/Counter';
import store, {
  increment,
  decrement,
  incrementIfOdd,
  incrementAsync,
} from './store';

function render() {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() => store.commit(increment)}
      onDecrement={() => store.commit(decrement)}
      onIncrementIfOdd={() => store.commit(incrementIfOdd)}
      onIncrementAsync={() => store.run(incrementAsync, 500)}
    />,
    document.getElementById('root')
  );
}

render();
store.onMutation(render);
