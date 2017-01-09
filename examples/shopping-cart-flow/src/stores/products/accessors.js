// @flow

import { getter, mutation, actionWith } from 'slux';
import type { ProductsGetter, ProductsMutation, ProductsAction } from './';
import shop from '../../api/shop';
import type { ShopAPI } from '../../api/shop';
import type { Product } from '../../types';

export const hasStock: ProductsGetter<number, boolean> = getter(
  (_, { query }, id) => {
    const product = query(getProduct, id);
    return product && product.inventory > 0;
  }
);

export const getProduct: ProductsGetter<number, Product> = getter(
  (state, _, id) => state.byId[id]
);

export const getVisibleProducts: ProductsGetter<void, Product[]> = getter(
  ({ visibleIds }, { query }) => visibleIds.map(id => query(getProduct, id))
);

export const pickup: ProductsMutation<number> = mutation(
  'Pickup',
  (state, _, productId) => {
    state.byId[productId].inventory -= 1;
    return state;
  }
);

type ById = { [key: number]: Product };
export const initialize: ProductsMutation<Product[]> = mutation(
  'Initialize',
  (state, _, products) => {
    const byId: ById = products.reduce((map: ById, product) => {
      map[product.id] = product;
      return map;
    }, {});
    const visibleIds: number[] = products.map(p => p.id);
    return { byId, visibleIds };
  }
);

export const loadProducts: ProductsAction<void, void> = actionWith(shop)(
  'Load Products',
  (shop: ShopAPI) => ({ commit }) => {
    shop.fetchProducts(products => {
      commit(initialize, products);
    });
  }
);
