import connect from '../connect';
import Cart from './Cart';

const mapToProps = methods => ({
  products: methods.getCartProducts(),
  total: methods.getTotal().toFixed(2),
  checkout: methods.checkout,
});

const CartContainer = connect(mapToProps)(Cart);

export default CartContainer;
