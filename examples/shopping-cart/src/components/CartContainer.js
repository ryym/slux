import connect from '../connect';
import Cart from './Cart';

const mapToProps = facade => ({
  products: facade.cartProducts,
  total: facade.totalAmount,
  checkout: facade.checkout,
});

const CartContainer = connect(mapToProps)(Cart);

export default CartContainer;
