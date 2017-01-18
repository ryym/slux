const createStore = (name, {
  getInitialState = () => ({}),
  takeSnapshot = state => state,

  // XXX: action内でstateの更新メソッドを呼びたい場合もありうる
  // やっぱり一旦なしで
  // createReadonlyState = getState => getState,
}) => {

}


const createMutation = (filterState = state => state) => {
  return (type, func) => {
    const id = 0
    return payload => ({
      _id: id,
      type,
      payload,
      exec: func,
    })
  }
}

const mutation = createMutation()

class Store {

  commit(mutation) {
    const { exec, payload } = mutation
    const nextState = exec(payload)
  }
}

mutation(
  '',
  (state, payload) => {
    // state.someFunc(payload.id)
    return state
  }
)

const dispatcher = createDispatcher(store, to => ({
  addFoo: to(addFoo)
}))

const commands = dispatcher.getCommands()

dispatcher.dispatch(commands.addFoo(id))
