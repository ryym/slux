import { mutation, effect } from 'slux';
import { clearCart, restoreCart } from './cart';

export * from './cart';
export * from './catalog';

export const addToCart = mutation(
  'Add Product to Cart',
  (shopping, productId) => {
    shopping.addToCart(productId);
    return shopping;
  }
);

export const finishCheckout = mutation(
  'Finish Checkout',
  shopping => shopping
);

export const checkout = effect(
  'Checkout',
  ({ commit }, shopping) => {
    const currentContent = shopping.cart.getContent();
    commit(clearCart);

    const cartProducts = shopping.getCartProducts();
    return shopping.checkout(cartProducts).then(err => {
      err ? commit(restoreCart, currentContent) : commit(finishCheckout);
    });
  }
);