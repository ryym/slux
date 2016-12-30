import connectComponent from './connectComponent';

export default function defaultConnect(
  mapStateToProps = (query, props) => props,
  mapDispatchToProps = dispatch => ({ dispatch })
) {
  return Component => connectComponent(Component, {
    mapStateToProps: (store, props) => mapStateToProps(store.query, props),
    mapDispatchToProps,
  });
}
