/**
 * Mocking client-server processing
 */
import _products from './products';

const delayWith = (time, action) => (...args) => setTimeout(() => {
  return action(...args);
}, time);

export default {

  // fetchProducts: (cb, timeout) => setTimeout(() => cb(_products), timeout || TIMEOUT),
  // buyProducts: (payload, cb, timeout) => setTimeout(() => cb(), timeout || TIMEOUT)

  fetchProducts: delayWith(100, callback => callback(_products)),
  buyProducts: delayWith(100, (products, callback) => callback()),
};
