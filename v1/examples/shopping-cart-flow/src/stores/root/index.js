import { TypedStore } from 'slux';
import cart from '../cart';
import products from '../products';

const getters = {
  getTotal: ({ getters: g }) => () => {
    return g.getCartProducts().reduce((total, p) =>
      total + p.price + p.quantity,
      0
    );
  },

  getCartProducts: ({ getters: g }) => () => {
    return g.cart.getAddedIds().map(id => ({
      ...g.products.getProduct(id),
      quantity: g.cart.getQuantity(id),
    }));
  },

  getVisibleProducts: c => () => c.getters.products.getVisibleProducts(),
};

const mutations = {
  addToCart: ({ mutations: m, getters: g }) => productId => {
    if (g.products.hasStock(productId)) {
      m.products.pickup(productId);
      m.cart.addProduct(productId);
    }
  },
};

export default new TypedStore({
  name: 'RootStore',
  getters,
  mutations,
  subStores: { cart, products },
});
