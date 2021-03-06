import { combineStores } from 'slux';
import cartStore from '../cart';
import productsStore from '../products';

const takeSnapshot = (_, { cart, products }) => ({
  cart: cart.takeSnapshot(),
  products: products.takeSnapshot(),
});

export default combineStores({
  name: 'RootStore',
  stores: getRef => ({
    cart: getRef(cartStore),
    products: getRef(productsStore),
  }),
  getInitialState: () => {},
  takeSnapshot,
});
