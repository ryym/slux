import _products from './products';

const delayWith = (time, action) => (...args) => setTimeout(() => {
  return action(...args);
}, time);

export default {
  fetchProducts: delayWith(100, callback => callback(_products)),
  buyProducts: delayWith(100, (products, callback) => callback()),
};
