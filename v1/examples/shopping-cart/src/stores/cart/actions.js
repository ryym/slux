import shop from '../../api/shop';

export const checkout = ({ mutations: m, getters: g }, products) => {
  const cart = g.getOwnState();
  m.startCheckout();
  shop.buyProducts(products, err => {
    err ? m.restore(cart) : m.finishCheckout();
  });
};

