import _products from './products';

export default {
  fetchProducts: () =>
    new Promise(resolve => resolve(_products)),

  buyProducts: (/* products */) =>
    new Promise(resolve => setTimeout(() => resolve(), 100)),
};
