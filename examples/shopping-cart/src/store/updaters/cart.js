import { cartMutation as mutation } from '../'

export const clearCart = mutation(
  'Start Checkout',
  cart => cart.reset()
);

export const restoreCart = mutation(
  'Restore Cart',
  (cart, content) => cart.setContent(content)
);

export const addProduct = mutation(
  'Add Product',
  (cart, productId) => {
    cart.addProduct(productId)
    return cart
  }
);
