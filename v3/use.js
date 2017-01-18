const {
  createStore,
  createMutation,
  mutation, action,
  createDispatcherWithCommands
// } = require('./slux')
} = require('../')


const store = createStore('test', {
  getInitialState: () => ({ value: 0 }),
  takeSnapshot: s => s.value,
})

console.log(store.getState())

store.onStateChange(m => {
  console.log('CHANGE', m, store.getState())
})

const increment = mutation(
  'Increment',
  (s, add) => {
    s.value += add
    return s
  }
)

store.commit(increment, 2)

const incrementAsync = action(
  'Increment-Async',
  ({ commit }, _, { add, delay = 100 }) => {
    setTimeout(() => {
      commit(increment, add)
    }, delay)
  }
)

const mutation2 = createMutation(
  s => s.value,
  (s, v) => {
    s.value = v
    return s
  }
)
const increment2 = mutation2(
  'Increment2', n => n + 1
)
store.commit(increment2)


store.run(incrementAsync, { add: 3, delay: 200 })
store.commit(increment, 1)


const { dispatcher, commands } = createDispatcherWithCommands(store, to => ({
  increment: to(increment),
  incrementAsync: to(incrementAsync)
}))

// console.log(commands)
dispatcher.dispatch(commands.increment, 8)
dispatcher.dispatch(commands.incrementAsync, { add: 10 })
