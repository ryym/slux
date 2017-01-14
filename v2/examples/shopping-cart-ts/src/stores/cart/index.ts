import {
    createStore,
    GetterContext, MutationContext, ActionContext,
    SingleStoreRef
} from 'slux';

export interface CartState {
    addedIds: number[];
    quantityById: { [key: number]: number };
}

export type CartGcx = GetterContext<CartState>;
export type CartMcx = MutationContext<CartState>;
export type CartAcx = ActionContext<CartState>;
export type CartStoreRef = SingleStoreRef<CartState, CartState>;

const getInitialState = (): CartState => ({
    addedIds: [],
    quantityById: {},
});

const takeSnapshot = (state: CartState): CartState => ({
    addedIds: state.addedIds.slice(0),
    quantityById: { ...state.quantityById },
});

export default createStore({
    name: 'CartStore',
    getInitialState,
    takeSnapshot,
});
