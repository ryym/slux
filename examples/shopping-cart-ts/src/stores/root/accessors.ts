import {
    getter, mutation, action,
    CombinedGetterContext,
    CombinedMutationContext,
    CombinedActionContext
} from 'slux';
import { Product, CartProduct } from '../../types';

import {
    RootState, RootSubStores,
    RootGcx, RootMcx, RootAcx
} from './';

import { getQuantity, getAddedIds, addProduct } from '../cart/accessors';
import { getProduct, hasStock, pickup } from '../products/accessors';

export const getTotal = getter(
    (_: RootState, { query, stores: { self } }: RootGcx): number => {
        return query(self, getCartProducts).reduce((total, p) =>
           total + p.price + p.quantity,
           0
        );
    }
);

export const getCartProducts = getter(
    (_: RootState, { query, stores: { cart, products } }: RootGcx): CartProduct[] => {
        return query(cart, getAddedIds).map(id => ({
            ...query(products, getProduct, id),
            quantity: query(cart, getQuantity, id)
        }));
    }
);

export const addToCart = mutation(
    'Add Product to Cart',
    (_: RootState, context: RootMcx, productId: number): RootState => {
        const { query, commit, stores: { cart, products } } = context;
        if (query(products, hasStock, productId)) {
            commit(products, pickup, productId);
            commit(cart, addProduct, productId);
        }
    }
);
