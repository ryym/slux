import shop from '../api/shop'

export default class ShoppingState {
  constructor(cart, catalog, shop) {
    this.cart = cart
    this.catalog = catalog
    this.shop = shop
  }

  getCartProducts() {
    const { cart, catalog } = this
    return cart.getAddedIds().map(id => ({
      ...catalog.getProduct(id),
      quantity: cart.getQuantity(id)
    }))
  }

  getTotalAmount() {
    return this.getCartProducts().reduce(
      (total, p) => total + p.price + p.quantity,
      0
    )
  }

  addToCart(productId) {
    if (this.catalog.hasStock(productId)) {
      this.catalog.pickup(productId)
      this.cart.addProduct(productId)
    }
  }

  checkout(products) {
    return this.shop.buyProducts(products)
  }

  takeSnapshot() {
    return {
      cart: this.cart.takeSnapshot(),
      catalog: this.catalog.takeSnapshot()
    }
  }
}

ShoppingState.create = (cart, catalog) => new ShoppingState(cart, catalog, shop)
