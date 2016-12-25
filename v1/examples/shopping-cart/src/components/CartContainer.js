import { connect } from 'slux/react';
import Cart from './Cart';
import { commands } from '../dispatcher';

const mapStateToProps = (g) => ({
  products: g.getCartProducts(),
  total: g.getTotal().toFixed(2),
});

const mapDispatchToProps = dispatch => ({
  checkout: (products) => dispatch(commands.checkout(products)),
});

const CartContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);

export default CartContainer;
