// @flow

import {
  createStore, combineStores, createDispatcher,
  getter, getterWith, mutation, mutationWith, action, actionWith,

  createConnector
} from './slux'

import type {
  GetterContext, MutationContext, ActionContext,
  CombinedGetterContext, CombinedMutationContext, CombinedActionContext,
  CombinedQuery,
  SingleSealedStore, CombinedSealedStore
} from './slux'

type Product = {|
  id: number,
  title: string,
  price: number,
  inventory: number
|}

// API
interface ShopAPI {
  buyProducts(productIds: number[], callback: () => void): void;
}
const shop: ShopAPI = {
  buyProducts(products, callback) {}
}

// ================= Single Store =================

/// Cart Store

type CartState = {|
  addedIds: number[],
  quantityById: {
    [key: number]: number
  }
|}
type CartSnapshot = {
  cart: CartState,
  version: number
}

type CartGcx = GetterContext<CartState>
type CartMcx = MutationContext<CartState>
type CartAcx = ActionContext<CartState>

const getInitialCartState = (): CartState => ({
  addedIds: [],
  quantityById: {}
})

export const cartStore = createStore({
  getInitialState: getInitialCartState,
  takeSnapshot: (state): CartSnapshot => ({ cart: state, version: 1 })
})

// Getters
export const getQuantity = getter((state: CartState, _, productId: number): number => {
  return state.quantityById[productId] || 0
})
export const hasProduct = getter((state: CartState, _, productId: number): boolean => {
  return state.addedIds.indexOf(productId) >= 0
})
export const getCurrentCart = getter((state: CartState): CartState => {
  return state
})
export const getAddedIds = getter((state: CartState): number[] => state.addedIds)
const getQuantity2 = getterWith(
  10,
  (seed: number) => (s: CartState, { query }: CartGcx, productId: number): number => {
    return query(getQuantity, productId) + seed
  }
)

// Mutations
export const addProduct = mutation(
  'Add Product',
  (state: CartState, { query }: CartMcx, productId: number): CartState => {
    const { addedIds, quantityById } = state
    if (! query(hasProduct, productId)) {
      addedIds.push(productId)
    }
    quantityById[productId] = (quantityById[productId] || 0) + 1
    return state
  }
)
export const startCheckout = mutation('Start Checkout', (): CartState => {
  return getInitialCartState()
})
export const finishCheckout = mutation(
  'Finish Checkout',
  (s: CartState): CartState => s
)
const someCartMutation = mutationWith(
  "key", "Some mutation",
  (key: string) => (state: CartState, { commit }: CartMcx): CartState => {
    return state
  }
)
cartStore.commit(someCartMutation)

// Actions
export const checkout = actionWith(
  shop,
  'Checkout and Clear Cart',
  (shop: ShopAPI) => ({ query, commit }: CartAcx): number[] => {
    const cart = query(getCurrentCart)
    const ids = query(getAddedIds)

    commit(startCheckout)
    shop.buyProducts(ids, () => { commit(finishCheckout) })
    return ids
    // return Promise.resolve(ids)
  }
)

export const checkCartStore = () => {
  var state: CartState

  state = cartStore.getState()
  console.log('initial', state)
  var snapshot: CartSnapshot = cartStore.takeSnapshot()
  console.log('snapshot', snapshot)

  state = cartStore.commit(addProduct, 1)
  console.log('add product', state)

  const quantity: number = cartStore.query(getQuantity, 1)
  console.log('get quantity', quantity)

  // 本当は非同期
  const ids: number[] = cartStore.run(checkout)
  console.log('checkout', ids, cartStore.getState())
}

//// Products Store

type ProductsState = {|
  visibleIds: number[],
  byId: {
    [key: number]: Product
  }
|}
type ProductsSnapshot = {
  byId: {
    [key: number]: Product
  }
}

type ProductsGcx = GetterContext<ProductsState>

const getInitialProductsState = (): ProductsState => ({
  byId: {},
  visibleIds: [],
});

const productsStore = createStore({
  getInitialState: getInitialProductsState,
  takeSnapshot: (s): ProductsSnapshot => ({
    byId: s.byId
  })
})

// Getters
export const getProduct = getter(
  (s: ProductsState, _, id: number): Product => s.byId[id]
)
export const hasStock = getter(
  (s: ProductsState, { query }: ProductsGcx, id: number): boolean =>
    Boolean(query(getProduct, id))
)

// Mutations
export const initializeProducts = mutation(
  'Initialize Products',
  (state: ProductsState, _, products: Product[]): ProductsState => {
    state.byId = products.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});
    state.visibleIds = products.map(p => p.id);
    return state
  }
)

export const pickup = mutation(
  'Pickup Product',
  (state: ProductsState, _, id: number): ProductsState => {
    state.byId[id].inventory -= 1;
    return state
  }
)

// ================= Combined Store =================

type RootState = {}

type RootSubStores = {|
  cart: SingleSealedStore<CartState, any>,
  products: SingleSealedStore<ProductsState, any>
|}
type RootSnapshot = {
  cart: CartSnapshot,
  products: ProductsSnapshot
}

type RootGcx = CombinedGetterContext<RootState, RootSubStores>
type RootMcx = CombinedMutationContext<RootState, RootSubStores>

const rootStore = combineStores({
  getInitialState: (): RootState => ({}),
  stores: (seal) => ({
    cart: seal(cartStore),
    products: seal(productsStore)
  }),
  takeSnapshot: (_, { cart, products }): RootSnapshot => ({
    cart: cart.takeSnapshot(),
    products: products.takeSnapshot()
  })
})

type CartProduct = {
  product: Product,
  quantity: number
}

// Getters
export const getCartProducts = getter(
  (_, { query, stores: { cart, products } }: RootGcx): CartProduct[] => {
    return query(cart, getAddedIds).map(id => {
      const product = query(products, getProduct, id)
      const quantity = query(cart, getQuantity, id)
      return { product, quantity }
    })
  }
)

// Mutations
export const addToCart = mutation(
  'Add Product to Cart',
  (s: RootState, { query, commit, stores }: RootMcx, id: number): RootState => {
    const { cart, products } = stores
    if (!query(products, hasStock, id)) {
      commit(products, pickup, id)
      commit(cart, addProduct, id)
    }
    return s
  }
)

export const checkRootStoreProducts = () => {
  console.log('root: products', rootStore.query(getCartProducts))

  rootStore.withSubs(({ stores, commit }) => {
    const { cart, products } = stores
    const _products: Product[] = [
      { 'id': 1, 'title': 'iPad 4 Mini', 'price': 500.01, 'inventory': 2 },
      { 'id': 2, 'title': 'H&M T-Shirt White', 'price': 10.99, 'inventory': 10 },
      { 'id': 3, 'title': 'Charli XCX - Sucker CD', 'price': 19.99, 'inventory': 5 },
    ];

    commit(products, initializeProducts, _products)
    commit(cart, addProduct, 1)
    commit(cart, addProduct, 1)
    commit(cart, addProduct, 3)
  })

  console.log('root: products', rootStore.query(getCartProducts))
}

// ================= Dispatcher =================

const { dispatcher, commands } = createDispatcher(cartStore, (commit, run) => {
  return {
    addProduct: commit(addProduct),
    checkout: run(checkout)
  }
})

export const checkDispatcher = () => {
  cartStore.run(checkout) // Clear

  console.log(commands)
  dispatcher.dispatch(commands.addProduct(1))
  dispatcher.dispatch(commands.addProduct(1))
  console.log('dispatch: add product', cartStore.getState())
  dispatcher.dispatch(commands.checkout())
  console.log('dispatch: checkout', cartStore.getState())
}

// ================= Connect =================

type AccessibleStores = {
  root: CombinedSealedStore<RootState, RootSubStores, any>,
  cart: SingleSealedStore<CartState, any>
}

const connect = createConnector(s => ({
  root: s(rootStore),
  cart: s(cartStore)
}))

// NOTE: Flowだと、メソッドに型定義をしなくても、それが使われている場所から
// 推論してくれるらしい。けど、やはり独立して書く時には型指定したい。
const mapStateToProps = (query: CombinedQuery, { root, cart }: AccessibleStores) => {
  const products: CartProduct[] = query(root, getCartProducts)
  return {
    products,
    quantity: query(cart, getQuantity, 1)
  }
}

var a: number = connect(
  mapStateToProps
)("component")
