// @flow

import type { CustomQuery, ConnectedComponentClass } from 'slux/react';
import connect from '../connect';
import type { Stores } from '../connect';
import Cart from './Cart';
import { commands } from '../dispatcher';
import {
    getCartProducts,
    getTotal,
} from '../stores/root/accessors';

import type { Dispatch } from 'slux';
import type { Product } from '../types';

const mapStateToProps = (query: CustomQuery, { root }: Stores): {} => ({
  products: query(root, getCartProducts),
  total: query(root, getTotal),
});

const mapDispatchToProps = (dispatch: Dispatch): {} => ({
  checkout: (products: Product[]) => dispatch(commands.checkout, products),
});

const CartContainer: ConnectedComponentClass<{}> = connect(
    mapStateToProps,
    mapDispatchToProps
)(Cart);

export default CartContainer;
