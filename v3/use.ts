import {
  createStore,
  createMutation,
  mutation,
  action,
  createDispatcherWithCommands,

  some,

  Store,
  // Commit,
  // Mutation,
} from '../slux'

const v = some(
  (m2) => ({
      b: 1,
      ...m2
  }),
  () => ({ a: 1 })
)
var aaa: string = v.c


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

const increment = mutation(
  'Increment', (s: State, add: number): State => {
    s.value += add
    return s
  }
)

store.commit(increment, 2)

const mutation2 = createMutation<State, number>(
  s => s.value,
  (s, v) => {
    s.value = v
    return s
  }
)
const increment2 = mutation2(
  'Increment2', (n: number): number => n + 1
)
store.commit(increment2)

const incrementAsync = action(
  'Increment-Async',
  ({ commit }: Store<State, number>, _: State, { add, delay = 100 }: { add: number, delay?: number }): void => {
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
