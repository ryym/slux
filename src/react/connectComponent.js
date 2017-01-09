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
    stateTracker,
    mapToProps,
  } = configs;
  const methods = stateTracker.methods;

  class Connect extends Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        mappedProps: mapToProps(methods, props),
      };

      this.handleStateChange = this.handleStateChange.bind(this);
    }

    componentDidMount() {
      if (! this.unsubscribe) {
        this.unsubscribe = stateTracker.onStateChange(this.handleStateChange);
      }
    }

    componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }

    handleStateChange() {
      const mappedProps = mapToProps(methods, this.props);
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
