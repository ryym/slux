import { action, actionWith } from 'slux'
import Catalog from '../../state-model/Catalog'
import shop from '../../api/shop'
import { catalogMutation as mutation } from '../'

export const replaceCatalog = mutation(
  'Replace Catalog',
  (_, newCatalog) => newCatalog
);

export const loadProducts = actionWith({
    shop,
    createCatalog: products => new Catalog(products)
})(
  'Load Products',
  ({ shop, createCatalog }) => ({ commit }) => {
    return shop.fetchProducts().then(products => {
      const newCatalog = createCatalog(products)
      commit(replaceCatalog, newCatalog);
    });
  }
);
