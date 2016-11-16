import React from 'react';
import sluxContextPropType from './slux-context-prop-type'

// XXX: シグネチャはReduxと同じ方がいい？
export default function connect(
  Component,
  mapStateToProps = () => {}
) {
  return React.createClass({
    displayName: `Connect(${Component.name})`,

    contextTypes: {
      sluxContext: sluxContextPropType
    },

    childContextTypes: {
      sluxContext: sluxContextPropType
    },

    getChildContext() {
      return {
        sluxContext: {
          dispatcher: this.context.sluxContext.dispatcher,
          hasConnectedParent: true
        }
      }
    },

    componentDidMount() {
      if (! this.context.sluxContext.hasConnectedParent) {
        const store = this.context.sluxContext.dispatcher.getStore()
        this.unsubscribe = store.subscribe((n, commit) => {
          this.forceUpdate()
        });
      }
    },

    componentWillUnmount() {
      if (! this.context.sluxContext.hasConnectedParent) {
        this.unsubscribe();
      }
    },

    render() {
      // const { children, ...restProps } = this.props;
      // XXX: これだとconnectされるコンポーネントに空の`children`が渡る
      const { props } = this
      const { dispatcher } = this.context.sluxContext
      const store = dispatcher.getStore()
      const dispatch = dispatcher.dispatch

      // XXX: mapDispatchToProps?
      const mappedProps = mapStateToProps({
        getters: store.getters,
        dispatch,
      }, props);

      return (
        <Component
          {...mappedProps}
          dispatch={dispatch}
        >
          {props.children}
        </Component>
      );
    },
  });
}
