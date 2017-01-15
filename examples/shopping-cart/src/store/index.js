import { createStore, createMutation } from 'slux';
import Cart from '../state-model/Cart'
import Catalog from '../state-model/Catalog'
import ShoppingState from '../state-model/ShoppingState'
import shop from '../api/shop'

const getInitialState = () => ShoppingState.create(
  new Cart(), new Catalog()
)

const takeSnapshot = shopping => shopping.takeSnapshot()

export default createStore('ShoppingCart', {
  getInitialState,
  takeSnapshot,
});

export const cartMutation = createMutation(
  shopping => shopping.cart,
  (shopping, cart) => ShoppingState.create(cart, shopping.catalog)
)

export const catalogMutation = createMutation(
  shopping => shopping.catalog,
  (shopping, catalog) => ShoppingState.create(shopping.cart, catalog)
)
