import React from 'react';
import storePropType from './store-prop-type';

// XXX: やはりmapDispatchも必要

// XXX: シグネチャはReduxと同じ方がいい？
export default function connect(
  Component,
  mapStateToProps = () => {}
) {
  return React.createClass({
    displayName: `Connect(${Component.name})`,

    contextTypes: {
      store: storePropType
    },

    getInitialState() {
      return this.getStore().getState();
    },

    componentWillMount() {
      this.store = this.getStore();
    },

    componentDidMount() {
      this.unsubscribe = this.store.subscribe((nextState) => {
        this.setState(nextState);
      });
    },

    componentWillUnmount() {
      this.unsubscribe();
    },

    render() {
      // const store = this.store;
      // const { children, ...restProps } = this.props;
      // XXX: これだとconnectされるコンポーネントに空の`children`が渡る
      const { store, props } = this
      const dispatch = store.dispatch.bind(store);

      // XXX
      const mappedProps = mapStateToProps(store._getters, props);

      return (
        <Component
          {...mappedProps}
          dispatch={dispatch}
        >
          {props.children}
        </Component>
      );
    },

    getStore() {
      return this.props.store || this.context.store;
    }
  });
}
