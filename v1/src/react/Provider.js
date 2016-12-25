import { Component, Children } from 'react';
import sluxContextPropType from './utils/slux-context-prop-type';

class Provider extends Component {
  getChildContext() {
    return {
      sluxContext: {
        dispatcher: this.props.dispatcher,
      },
    };
  }

  render() {
    return Children.only(this.props.children);
  }
}

Provider.childContextTypes = {
  sluxContext: sluxContextPropType,
};

export default Provider;
