/**
 * Store
 *   - Hold a state
 *   - Apply accessor methods to get or update the state
 *   - Take snapshot of the state
 */
export default class Store {
  constructor({
    getInitialState,
    takeSnapshot,
    createAccessorContexts,
  }) {
    this.query = this.query.bind(this);
    this.commit = this.commit.bind(this);
    this.run = this.run.bind(this);

    this.getInitialState = getInitialState;
    this._takeSnapshot = takeSnapshot;

    const { getter, mutation, action } = createAccessorContexts(this);
    this._getterContext = getter;
    this._mutationContext = mutation;
    this._actionContext = action;

    this._state = getInitialState();
  }

  query(getter, payload) {
    return getter(this.getState(), this._getterContext, payload);
  }

  commit(mutation, payload) {
    const nextState = mutation(this.getState(), this._mutationContext, payload);
    this._state = nextState;
    return nextState;
  }

  run(action, payload) {
    return action(this._actionContext, payload);
  }

  // TODO: implement
  onMutation() {}

  // TODO: implement
  onAction() {}

  // TODO: implement
  onStateChange() {}

  getState() {
    return this._state;
  }

  takeSnapshot() {
    return this._takeSnapshot(this._state);
  }
}
