import { mutation, actionWith } from 'slux';
import { getState, getInitialState } from 'slux/getters';
import { CartState, CartMcx, CartAcx } from '../';
import shop, { ShopAPI } from '../../../api/shop';
import { Product } from '../../../types';

export const startCheckout = mutation(
    'Start Checkout',
    (_: CartState, { query }: CartMcx) => query(getInitialState)
);

export const finishCheckout = mutation(
    'Finish Checkout',
    (state: CartState): CartState => state
);

export const restore = mutation(
    'Restore Cart',
    (state: CartState, _: CartMcx, cart: CartState): CartState => cart
);

export const checkout = actionWith(shop)(
    'Checkout',
    (shop: ShopAPI) => ({ query, commit }: CartAcx, products: Product[]): void => {
        const cart = query(getState);
        commit(startCheckout);
        shop.buyProducts(products, err => {
            err ? commit(restore, cart) : commit(finishCheckout);
        });
    }
);
