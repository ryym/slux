import connectComponent from './connectComponent';

const defaultPropsMapper = (tracker, props) => props;

export default function createConnector(stateTracker) {
  return function connect(
    mapToProps = defaultPropsMapper
  ) {
    return Component => connectComponent(Component, {
      stateTracker,
      mapToProps,
    });
  };
}
