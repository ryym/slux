import { Component, createElement } from 'react';
import sluxContextPropType from './utils/slux-context-prop-type'
import shallowEqual from './utils/shallowEqual'

// TODO: Optimization and configurability

// Update when:
// - Connect component receives next props
// - The store notifies a state update

export default function connect(mapStateToProps, mapDispatchToProps) {

  return function wrapWithConnect(WrappedComponent) {

    class Connect extends Component {
      constructor(props, context) {
        super(props, context)
        const { sluxContext } = context
        const dispatcher = sluxContext.dispatcher
        this.dispatch = dispatcher.dispatch
        this.store = dispatcher.getStore()
        this.dispatchProps = mapDispatchToProps(this.dispatch, props)
        this.state = {
          mappedProps: mapStateToProps(this.store.getters, props)
        }

        this.handleStoreUpdate = this.handleStoreUpdate.bind(this)
      }

      componentDidMount() {
        if (!this.unsubscribe) {
          this.unsubscribe = this.store.subscribe(this.handleStoreUpdate)
        }
      }

      componentWillUnmount() {
        if (this.unsubscribe) {
          this.unsubscribe()
        }
      }

      handleStoreUpdate(store) {
        const nextState = mapStateToProps(store.getters, this.props)
        if (! shallowEqual(this.state.mappedProps, nextState)) {
          this.setState({ mappedProps: nextState })
        }
      }

      render() {
        const { mappedProps } = this.state
        const mergedProps = Object.assign({}, mappedProps, this.dispatchProps, this.props)
        return createElement(WrappedComponent, mergedProps)
      }
    }

    Connect.displayName = `Connect(${WrappedComponent.displayName || WrappedComponent.name})`
    Connect.contextTypes = {
      sluxContext: sluxContextPropType
    }

    return Connect
  }
}
