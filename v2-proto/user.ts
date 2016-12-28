import {
  createStore, combineStores, createDispatcher,
  getter, mutation, action,
  GetterContext, MutationContext, ActionContext,
  CombinedGetterContext, CombinedMutationContext, CombinedActionContext,
  SingleSealedStore, CombinedSealedStore,
  createConnector, CombinedQuery
} from '../slux' // XXX

type Product = {
  id: number,
  title: string,
  price: number,
  inventory: number
}

// API
interface ShopAPI {
  buyProducts(productIds: number[], callback: () => void): void;
}
const shop: ShopAPI = {
  buyProducts(products, callback) {}
}

// ================= Single Store =================

/// Cart Store

type CartState = {
  addedIds: number[],
  quantityById: {
    [key: number]: number
  }
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
  takeSnapshot: (): number => 1
})

// Getters
export const getQuantity = getter(
    (state: CartState, _: CartGcx, productId: number): number => {
      return state.quantityById[productId] || 0
    }
)
export const hasProduct = getter(
    (state: CartState, _: CartGcx, productId: number): boolean => {
      return state.addedIds.indexOf(productId) >= 0
    }
)
export const getCurrentCart = getter(
    (state: CartState): CartState => state
)
export const getAddedIds = getter(
    (state: CartState): number[] => state.addedIds
)

// Mutations
export const addProduct = mutation((
  state: CartState, { query }: CartMcx, productId: number
): CartState => {
  const { addedIds, quantityById } = state
  if (! query(hasProduct, productId)) {
    addedIds.push(productId)
  }
  quantityById[productId] = (quantityById[productId] || 0) + 1
  return state
})
export const startCheckout = mutation(
    (): CartState => {
      return getInitialCartState()
    }
)
export const finishCheckout = mutation(
    (s: CartState): CartState => s
)

// Actions
export const checkout = action(
    (shop: ShopAPI) => ({ query, commit }: CartAcx): number[] => {
      const cart = query(getCurrentCart)
      const ids = query(getAddedIds)

      commit(startCheckout)
      shop.buyProducts(ids, () => { commit(finishCheckout) })
      return ids
      // return Promise.resolve(ids)
    },
    shop
)

export const checkCartStore = () => {
  var state: CartState

  state = cartStore.getState()
  console.log('initial', state)

  state = cartStore.commit(addProduct, 1)
  console.log('add product', state)

  const quantity: number = cartStore.query(getQuantity, 1)
  console.log('get quantity', quantity)

  // 本当は非同期
  const ids: number[] = cartStore.run(checkout)
  console.log('checkout', ids, cartStore.getState())
}

//// Products Store

type ProductsState = {
  visibleIds: number[],
  byId: {
    [key: number]: Product
  }
}

type ProductsGcx = GetterContext<ProductsState>
type ProductsMcx = MutationContext<ProductsState>

const getInitialProductsState = (): ProductsState => ({
  byId: {},
  visibleIds: [],
});

const productsStore = createStore({
  getInitialState: getInitialProductsState
})

// Getters
export const getProduct = getter(
  (s: ProductsState, _: ProductsGcx, id: number): Product =>
    s.byId[id]
)
export const hasStock = getter(
  (s: ProductsState, { query }: ProductsGcx, id: number): boolean =>
    Boolean(query(getProduct, id))
)

// Mutations
export const initializeProducts = mutation(
  (state: ProductsState, _: ProductsMcx, products: Product[]): ProductsState => {
    state.byId = products.reduce((map: { [id: number]: Product }, product) => {
      map[product.id] = product;
      return map;
    }, {});
    state.visibleIds = products.map(p => p.id);
    return state
  }
)

export const pickup = mutation(
  (state: ProductsState, _: ProductsMcx, id: number): ProductsState => {
    state.byId[id].inventory -= 1;
    return state
  }
)

// ================= Combined Store =================

type RootState = {}

type RootSubStores = {
  cart: SingleSealedStore<CartState, number>,
  products: SingleSealedStore<ProductsState, {}>
}

type RootGcx = CombinedGetterContext<RootState, RootSubStores>
type RootMcx = CombinedMutationContext<RootState, RootSubStores>

var a: {} = cartStore

const rootStore = combineStores({
  getInitialState: (): RootState => ({}),
  stores: (sub): RootSubStores => ({
    cart: sub(cartStore),
    products: sub(productsStore)
  }),
  takeSnapshot: (s: RootState, stores: RootSubStores): number => {
      return stores.cart.takeSnapshot()
  }
})

type CartProduct = {
  product: Product,
  quantity: number
}

// Getters
export const getCartProducts = getter(
  (_: RootState, { query, stores: { cart, products } }: RootGcx): CartProduct[] => {
    return query(cart, getAddedIds).map(id => {
      const product = query(products, getProduct, id)
      const quantity = query(cart, getQuantity, id)
      return { product, quantity }
    })
  }
)

// Mutations
export const addToCart = mutation(
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
    addProduct: commit('ADD_PRODUCT', addProduct),
    checkout: run('CHECKOUT', checkout)
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

const mapStateToProps = (query: CombinedQuery, { root, cart }: AccessibleStores) => {
  const products: CartProduct[] = query(root, getCartProducts)
  return {
    products,
    quantity: query(cart, getQuantity, 1)
  }
}

var connected: number = connect(
  mapStateToProps
)("component")
