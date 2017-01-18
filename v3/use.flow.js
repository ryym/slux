// @flow

const {
  createStore,
  createMutation,
  mutation,
  action,
  createDispatcherWithCommands,
  some,
} = require('./slux')
import type { Action, Mutation, CustomMutation, Store } from './slux'


type Props = {
  a: number,
  b: number
}

const v = some(
  (m2): Props => ({ b: 1, ...m2 }),
  () => ({ a: 1 })
)
// var aaa: string = v.b


type State = {
  value: number;
}

const store: Store<State, number> = createStore('test', {
  getInitialState: () => ({ value: 0 }),
  takeSnapshot: s => s.value,
})

store.onStateChange(m => {
  console.log('CHANGE', m, store.getState())
})

const increment: Mutation<State, number> = mutation(
  'Increment', (s, add) => {
    s.value += add
    return s
  }
)

store.commit(increment, 2)

const _mutation = createMutation(
  (s: State): number => s.value,
  (s: State, v: number): State => {
    s.value = v
    return s
  }
)
const increment2: CustomMutation<State, number, void> = _mutation(
  'Increment2', n => {
    return n + 1
  }
)

store.commit(increment2)

const incrementAsync: Action<State, { add: number, delay?: number }, void> = action(
  'Increment-Async',
  ({ commit }, _, { add, delay = 100 }) => {
    setTimeout(() => {
      commit(increment, add)
    }, delay)
  }
)

store.run(incrementAsync, { add: 1 })


const { dispatcher, commands } = createDispatcherWithCommands(store, to => ({
  increment: to(increment),
  inAsync: to(incrementAsync),
}))

dispatcher.dispatch(commands.increment, 2)
dispatcher.dispatch(commands.inAsync, { add: 2 })

const inc2Cmd = dispatcher.define(increment2)
dispatcher.dispatch(inc2Cmd)
