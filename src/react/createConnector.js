import connectComponent from './connectComponent';
import SealedStore from '../SealedStore';
import { query } from '../CombinedStore';

/**
 * This enables to access multiple stores inside of mapStateToProps.
 */
export default function createConnector(defineStores) {
  const stores = defineStores(store => new SealedStore(store));

  return function connect(
    mapStateToProps = (query, stores, props) => props,
    mapDispatchToProps = dispatch => ({ dispatch })
  ) {
    return Component => connectComponent(Component, {
      mapStateToProps: (store, props) => mapStateToProps(query, stores, props),
      mapDispatchToProps,
    });
  };
}
