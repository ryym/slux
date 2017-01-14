import { getter, mutation } from 'slux';
import { CartState, CartGcx, CartMcx } from '../';

export const getQuantity = getter(
    (state: CartState, _: CartGcx, productId: number): number =>
    state.quantityById[productId] || 0
);

export const getAddedIds = getter(
    (state: CartState): number[] => state.addedIds
);

export const hasProduct = getter(
    (state: CartState, _: CartGcx, productId: number): boolean =>
    state.addedIds.indexOf(productId) >= 0
);

export const addProduct = mutation(
    'Add Product',
    (state: CartState, { query }: CartMcx, productId: number): CartState => {
        const { addedIds, quantityById } = state;
        if (! query(hasProduct, productId)) {
            addedIds.push(productId);
        }
        quantityById[productId] = query(getQuantity, productId) + 1;

        return state;
    }
);
