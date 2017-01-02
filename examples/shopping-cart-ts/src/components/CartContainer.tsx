import { CustomQuery } from 'slux/react';
import connect, { Stores } from '../connect';
import Cart from './Cart';
import { commands } from '../dispatcher';
import {
    getCartProducts,
    getTotal
} from '../stores/root/accessors';

import { Dispatch } from 'slux';
import { CartProduct } from '../types';

const mapStateToProps = (query: CustomQuery, { root }: Stores): {} => ({
    products: query(root, getCartProducts),
    total: query(root, getTotal),
});

const mapDispatchToProps = (dispatch: Dispatch): {} => ({
    checkout: (products: CartProduct[]) => dispatch(commands.checkout, products),
});

const CartContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Cart);

export default CartContainer;
