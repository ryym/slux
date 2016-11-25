import React from 'react';
import sluxContextPropType from './utils/slux-context-prop-type'

export default class Provider extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  getChildContext() {
    return {
      sluxContext: {
        dispatcher: this.props.dispatcher,
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
