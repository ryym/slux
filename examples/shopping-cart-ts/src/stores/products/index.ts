import {
    createStore, getter, mutation,
    GetterContext, MutationContext, ActionContext,
    SingleSealedStore
} from 'slux';
import { Product } from '../../types';

export interface ProductsState {
    byId: { [key: number]: Product };
    visibleIds: number[];
};

export type ProductsGcx = GetterContext<ProductsState>;
export type ProductsMcx = MutationContext<ProductsState>;
export type ProductsAcx = ActionContext<ProductsState>;
export type SealedProductsStore = SingleSealedStore<ProductsState, any>;

const getInitialState = (): ProductsState => ({
    byId: {},
    visibleIds: [],
});

const takeSnapshot = (state: ProductsState): ProductsState => ({
    byId: { ...state.byId },
    visibleIds: state.visibleIds.slice(0),
});

export default createStore({
    name: 'ProductsStore',
    getInitialState,
    takeSnapshot,
});
