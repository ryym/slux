// @flow

import type { ConnectedComponentClass } from 'slux/react';
import connect from '../connect';
import type { Methods } from '../connect';
import Cart from './Cart';
import type { CartProps } from './Cart';

const mapToProps = (f: Methods): CartProps => ({
  products: f.getCartProducts(),
  total: f.getTotal(),
  checkout: f.checkout,
});

const CartContainer: ConnectedComponentClass<{}> = connect(mapToProps)(Cart);

export default CartContainer;
