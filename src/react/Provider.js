import React from 'react';
import sluxContextPropType from './slux-context-prop-type'

export default class Provider extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._dispatcher = props.dispatcher
  }

  getChildContext() {
    return {
      sluxContext: {
        dispatcher: this._dispatcher
      }
    };
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

Provider.childContextTypes = {
  sluxContext: sluxContextPropType
};
