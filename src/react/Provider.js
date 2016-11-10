import React from 'react';
import storePropType from './store-prop-type';

export default class Provider extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._store = props.store;
  }

  getChildContext() {
    return {
      store: this._store
    };
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

Provider.childContextTypes = {
  store: storePropType
};
