"use strict";
var slux_1 = require("../slux"); // XXX
var shop = {
    buyProducts: function (products, callback) { }
};
var getInitialCartState = function () { return ({
    addedIds: [],
    quantityById: {}
}); };
exports.cartStore = slux_1.createStore({
    getInitialState: getInitialCartState,
    takeSnapshot: function () { return 1; }
});
// Getters
exports.getQuantity = slux_1.getter(function (state, _, productId) {
    return state.quantityById[productId] || 0;
});
exports.hasProduct = slux_1.getter(function (state, _, productId) {
    return state.addedIds.indexOf(productId) >= 0;
});
exports.getCurrentCart = slux_1.getter(function (state) { return state; });
exports.getAddedIds = slux_1.getter(function (state) { return state.addedIds; });
var getQuantity2 = slux_1.getterWith(10, function (seed) { return function (s, _a, productId) {
    var query = _a.query;
    return query(exports.getQuantity, productId) + seed;
}; });
// Mutations
exports.addProduct = slux_1.mutation('Add Product', function (state, _a, productId) {
    var query = _a.query;
    var addedIds = state.addedIds, quantityById = state.quantityById;
    if (!query(exports.hasProduct, productId)) {
        addedIds.push(productId);
    }
    quantityById[productId] = (quantityById[productId] || 0) + 1;
    return state;
});
exports.startCheckout = slux_1.mutation('Start Checkout', function () {
    return getInitialCartState();
});
exports.finishCheckout = slux_1.mutation('Finish Checkout', function (s) { return s; });
var someCartMutation = slux_1.mutationWith("key", "Some mutation", function (key) { return function (state, _a) {
    var commit = _a.commit;
    return state;
}; });
exports.cartStore.commit(someCartMutation);
// Actions
exports.checkout = slux_1.actionWith(shop, 'Checkout and Clear Cart', function (shop) { return function (_a) {
    var query = _a.query, commit = _a.commit;
    var cart = query(exports.getCurrentCart);
    var ids = query(exports.getAddedIds);
    commit(exports.startCheckout);
    shop.buyProducts(ids, function () { commit(exports.finishCheckout); });
    return ids;
    // return Promise.resolve(ids)
}; });
exports.checkCartStore = function () {
    var state;
    state = exports.cartStore.getState();
    console.log('initial', state);
    state = exports.cartStore.commit(exports.addProduct, 1);
    console.log('add product', state);
    var quantity = exports.cartStore.query(exports.getQuantity, 1);
    console.log('get quantity', quantity);
    // 本当は非同期
    var ids = exports.cartStore.run(exports.checkout);
    console.log('checkout', ids, exports.cartStore.getState());
};
var getInitialProductsState = function () { return ({
    byId: {},
    visibleIds: [],
}); };
var productsStore = slux_1.createStore({
    getInitialState: getInitialProductsState
});
// Getters
exports.getProduct = slux_1.getter(function (s, _, id) {
    return s.byId[id];
});
exports.hasStock = slux_1.getter(function (s, _a, id) {
    var query = _a.query;
    return Boolean(query(exports.getProduct, id));
});
// Mutations
exports.initializeProducts = slux_1.mutation('Initialize Products', function (state, _, products) {
    state.byId = products.reduce(function (map, product) {
        map[product.id] = product;
        return map;
    }, {});
    state.visibleIds = products.map(function (p) { return p.id; });
    return state;
});
exports.pickup = slux_1.mutation('Pickup Product', function (state, _, id) {
    state.byId[id].inventory -= 1;
    return state;
});
var a = exports.cartStore;
var rootStore = slux_1.combineStores({
    getInitialState: function () { return ({}); },
    stores: function (sub) { return ({
        cart: sub(exports.cartStore),
        products: sub(productsStore)
    }); },
    takeSnapshot: function (s, stores) {
        return stores.cart.takeSnapshot();
    }
});
// Getters
exports.getCartProducts = slux_1.getter(function (_, _a) {
    var query = _a.query, _b = _a.stores, cart = _b.cart, products = _b.products;
    return query(cart, exports.getAddedIds).map(function (id) {
        var product = query(products, exports.getProduct, id);
        var quantity = query(cart, exports.getQuantity, id);
        return { product: product, quantity: quantity };
    });
});
// Mutations
exports.addToCart = slux_1.mutation('Add Product to Cart', function (s, _a, id) {
    var query = _a.query, commit = _a.commit, stores = _a.stores;
    var cart = stores.cart, products = stores.products;
    if (!query(products, exports.hasStock, id)) {
        commit(products, exports.pickup, id);
        commit(cart, exports.addProduct, id);
    }
    return s;
});
exports.checkRootStoreProducts = function () {
    console.log('root: products', rootStore.query(exports.getCartProducts));
    rootStore.withSubs(function (stores, _a) {
        var commit = _a.commit;
        var cart = stores.cart, products = stores.products;
        var _products = [
            { 'id': 1, 'title': 'iPad 4 Mini', 'price': 500.01, 'inventory': 2 },
            { 'id': 2, 'title': 'H&M T-Shirt White', 'price': 10.99, 'inventory': 10 },
            { 'id': 3, 'title': 'Charli XCX - Sucker CD', 'price': 19.99, 'inventory': 5 },
        ];
        commit(products, exports.initializeProducts, _products);
        commit(cart, exports.addProduct, 1);
        commit(cart, exports.addProduct, 1);
        commit(cart, exports.addProduct, 3);
    });
    console.log('root: products', rootStore.query(exports.getCartProducts));
};
// ================= Dispatcher =================
var _a = slux_1.createDispatcher(exports.cartStore, function (commit, run) {
    return {
        addProduct: commit(exports.addProduct),
        checkout: run(exports.checkout)
    };
}), dispatcher = _a.dispatcher, commands = _a.commands;
exports.checkDispatcher = function () {
    exports.cartStore.run(exports.checkout); // Clear
    console.log(commands);
    dispatcher.dispatch(commands.addProduct(1));
    dispatcher.dispatch(commands.addProduct(1));
    console.log('dispatch: add product', exports.cartStore.getState());
    dispatcher.dispatch(commands.checkout());
    console.log('dispatch: checkout', exports.cartStore.getState());
};
var connect = slux_1.createConnector(function (s) { return ({
    root: s(rootStore),
    cart: s(exports.cartStore)
}); });
var mapStateToProps = function (query, _a) {
    var root = _a.root, cart = _a.cart;
    var products = query(root, exports.getCartProducts);
    return {
        products: products,
        quantity: query(cart, exports.getQuantity, 1)
    };
};
var connected = connect(mapStateToProps)("component");
