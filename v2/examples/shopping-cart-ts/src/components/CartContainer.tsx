import connect, { Methods } from '../connect';
import Cart, { CartProps } from './Cart';
import { CartProduct } from '../types';

const mapToProps = (methods: Methods): CartProps => ({
    products: methods.getCartProducts(),
    total: methods.getTotal(),
    checkout: methods.checkout
})

const CartContainer = connect(mapToProps)(Cart);

export default CartContainer;
