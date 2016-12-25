import {
  createStore, combineStores, createDispatcher,
  getter, mutation, action
} from './slux'

// API
const shop = {
  buyProducts(products, callback) {}
}

// ================= Single Store =================

/// Cart Store

const getInitialCartState = () => ({
  addedIds: [],
  quantityById: {}
})

export const cartStore = createStore({
  getInitialState: getInitialCartState
})

// Getters
export const getQuantity = getter((state, _, productId) => {
  return state.quantityById[productId] || 0
})
export const hasProduct = getter((state, _, productId) => {
  return state.addedIds.indexOf(productId) >= 0
})
export const getCurrentCart = getter((state, _, productId) => {
  return state
})
export const getAddedIds = getter((state) => state.addedIds)

// Mutations
export const addProduct = mutation((state, { query }, productId) => {
  const { addedIds, quantityById } = state
  if (! query(hasProduct, productId)) {
    addedIds.push(productId)
  }
  quantityById[productId] = (quantityById[productId] || 0) + 1
  return state
})
export const startCheckout = mutation(() => {
  return getInitialCartState()
})
export const finishCheckout = mutation((s) => s)

// Actions
export const checkout = action(shop => ({ query, commit }) => {
  const cart = query(getCurrentCart)
  const ids = query(getAddedIds)

  commit(startCheckout)
  shop.buyProducts(ids, () => {
    commit(finishCheckout)
  })

  // return Promise.resolve(ids)
  return { then: callback => callback(ids) }
}, shop)

export const checkCartStore = () => {
  console.log('initial', cartStore.getState())
  console.log('add product', cartStore.commit(addProduct, 1))
  console.log('get quantity', cartStore.query(getQuantity, 1))

  cartStore.run(checkout).then(ids => {
    console.log('checkout', ids, cartStore.getState())
  })
}

//// Products Store

const getInitialProductsState = () => ({
  byId: {},
  visibleIds: [],
});

const productsStore = createStore({
  getInitialState: getInitialProductsState
})

// Getters
export const getProduct = getter((s, _, id) => s.byId[id])

// Mutations
export const initializeProducts = mutation((state, _, products) => {
  state.byId = products.reduce((map, product) => {
    map[product.id] = product;
    return map;
  }, {});
  state.visibleIds = products.map(p => p.id);
  return state
})

// ================= Combined Store =================

const rootStore = combineStores({
  getInitialState: () => ({}),
  stores: sub => ({
    cart: sub(cartStore),
    products: sub(productsStore)
  })
})

// Getters
export const getCartProducts = getter((_, { query, stores: { cart, products } }) => {
  return query(cart, getAddedIds).map(id => {
    const product = query(products, getProduct, id)
    return Object.assign(product, {
      quantity: query(cart, getQuantity, id)
    })
  })
})

export const checkRootStoreProducts = () => {
  console.log('root: products', rootStore.query(getCartProducts))

  rootStore.withSubs(({ stores, commit }) => {
    const { cart, products } = stores
    const _products = [
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
