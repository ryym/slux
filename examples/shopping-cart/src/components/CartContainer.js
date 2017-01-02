import connect from '../connect';
import Cart from './Cart';
import { commands } from '../dispatcher';
import {
  getCartProducts,
  getTotal,
} from '../stores/root/accessors';

const mapStateToProps = (query, { root }) => ({
  products: query(root, getCartProducts),
  total: query(root, getTotal).toFixed(2),
});

const mapDispatchToProps = dispatch => ({
  checkout: products => dispatch(commands.checkout, products),
});

const CartContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);

export default CartContainer;
