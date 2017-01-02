import { getter, mutation, actionWith } from 'slux';
import shop from '../../api/shop';

export const hasStock = getter(
  (_, { query }, id) => {
    const product = query(getProduct, id);
    return product && product.inventory > 0;
  }
);

export const getProduct = getter(
  (state, _, id) => state.byId[id]
);

export const getVisibleProducts = getter(
  ({ visibleIds }, { query }) => visibleIds.map(id => query(getProduct, id))
);

export const pickup = mutation(
  'Pickup',
  (state, _, productId) => {
    state.byId[productId].inventory -= 1;
    return state;
  }
);

export const initialize = mutation(
  'Initialize',
  (state, _, products) => {
    const byId = products.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});
    const visibleIds = products.map(p => p.id);
    return { byId, visibleIds };
  }
);

export const loadProducts = actionWith(
  shop,
  'Load Products',
  shop => ({ commit }) => {
    return shop.fetchProducts().then(products => {
      commit(initialize, products);
    });
  }
);
