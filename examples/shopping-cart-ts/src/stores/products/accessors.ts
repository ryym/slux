import { getter, mutation, actionWith } from 'slux';
import { ProductsState, ProductsGcx, ProductsMcx, ProductsAcx } from './';
import shop, { ShopAPI } from '../../api/shop';
import { Product } from '../../types';

export const hasStock = getter(
    (_: ProductsState, { query }: ProductsGcx, id: number): boolean => {
        const product = query(getProduct, id);
        return product && product.inventory > 0;
    }
);

export const getProduct = getter(
    (state: ProductsState, _: ProductsGcx, id: number): Product =>
        state.byId[id]
);

export const getVisibleProducts = getter(
    ({ visibleIds }: ProductsState, { query }: ProductsGcx): Product[] =>
        visibleIds.map(id => query(getProduct, id))
);

export const pickup = mutation(
    'Pickup',
    (state: ProductsState, _: ProductsMcx, productId: number): ProductsState => {
        state.byId[productId].inventory -= 1;
        return state;
    }
);

type ById = { [key: number]: Product };
export const initialize = mutation(
    'Initialize',
    (state: ProductsState, _: ProductsMcx, products: Product[]): ProductsState => {
        const byId: ById = products.reduce((map: ById, product) => {
            map[product.id] = product;
            return map;
        }, {});
        const visibleIds: number[] = products.map(p => p.id);
        return { byId, visibleIds };
    }
);

export const loadProducts = actionWith(shop)(
    'Load Products',
    (shop: ShopAPI) => ({ commit }: ProductsAcx): void => {
        shop.fetchProducts(products => {
            commit(initialize, products);
        });
    }
);
