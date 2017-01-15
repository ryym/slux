import connectComponent from './connectComponent';

const defaults = {
  buildFacadeCreator: (_, getState) => getState,
  defineProps: (state, dispatch, props) => ({
    state,
    dispatch,
    ...props,
  }),
};


export default function createConnector(
  dispatcher,
  buildFacadeCreator = defaults.buildFacadeCreator
) {
  return function connect(defineProps = defaults.defineProps) {
    return Component => connectComponent(Component, {
      dispatcher,
      defineProps,
      buildFacadeCreator,
    });
  };
}
