import { Component, createElement } from 'react';
import sluxContextPropType from './utils/slux-context-prop-type';
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
    mapStateToProps,
    mapDispatchToProps,
  } = configs;

  class Connect extends Component {
    constructor(props, context) {
      super(props, context);
      const { sluxContext } = context;
      const dispatcher = sluxContext.dispatcher;

      this.dispatch = dispatcher.dispatch;
      this.store = dispatcher.getStore();
      this.dispatchProps = mapDispatchToProps(this.dispatch, props);
      this.state = {
        mappedProps: mapStateToProps(this.store, props),
      };

      this.handleStateChange = this.handleStateChange.bind(this);
    }

    componentDidMount() {
      if (! this.unsubscribe) {
        this.unsubscribe = this.store.onMutation(this.handleStateChange);
      }
    }

    componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }

    handleStateChange() {
      const nextState = mapStateToProps(this.store, this.props);
      if (! shallowEqual(this.state.mappedProps, nextState)) {
        this.setState({ mappedProps: nextState });
      }
    }

    render() {
      const { mappedProps } = this.state;
      const mergedProps = {
        ...mappedProps,
        ...this.dispatchProps,
        ...this.props,
      };
      return createElement(WrappedComponent, mergedProps);
    }
  }

  Connect.displayName = `Connect(${WrappedComponent.displayName || WrappedComponent.name})`;
  Connect.contextTypes = {
    sluxContext: sluxContextPropType,
  };

  return Connect;
}
