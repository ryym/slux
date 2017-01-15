import { Component, createElement } from 'react';
import shallowEqual from './utils/shallowEqual';

// TODO: Optimization and configurability

/**
 * Create a wrapper component which subscribes a store's change.
 * The component will be updated when:
 *   - the wrapper receives next props
 *   - the store notifies a state change
 */
export default function connectComponent(WrappedComponent, configs) {
  const {
    dispatcher,
    defineProps,
    buildFacadeCreator,
  } = configs;

  const store = dispatcher.getStore();
  const createFacade = buildFacadeCreator(dispatcher.dispatch, store.getState);

  class Connect extends Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        mappedProps: this.mapStateToProps(),
      };

      this.handleStateChange = this.handleStateChange.bind(this);
    }

    mapStateToProps() {
      const facade = createFacade(store.getState());
      return defineProps(facade, dispatcher.dispatch, this.props);
    }

    componentDidMount() {
      if (! this.unsubscribe) {
        this.unsubscribe = store.onStateChange(this.handleStateChange);
      }
    }

    componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }

    handleStateChange() {
      const mappedProps = this.mapStateToProps();
      if (! shallowEqual(this.state.mappedProps, mappedProps)) {
        this.setState({ mappedProps });
      }
    }

    render() {
      const { mappedProps } = this.state;
      return createElement(WrappedComponent, mappedProps);
    }
  }

  Connect.displayName = `Connect(${WrappedComponent.displayName || WrappedComponent.name})`;

  return Connect;
}
