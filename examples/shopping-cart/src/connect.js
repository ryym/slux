import { createConnector } from 'slux/react';
import { dispatcher, commands } from './dispatcher'

export default createConnector(dispatcher, (dispatch /*, getState */) => {
  const checkout = () => dispatch(commands.checkout)
  const addToCart = id => dispatch(commands.addToCart, id)

  return shopping => ({
    cartProducts: shopping.getCartProducts(),
    totalAmount: shopping.getTotalAmount(),
    products: shopping.catalog.getVisibleProducts(),
    checkout,
    addToCart,
  })
})
