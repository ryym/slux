const arrangeProducts = products => {
  const byId = products.reduce((map, product) => {
    map[product.id] = product;
    return map;
  }, {});
  const visibleIds = products.map(p => p.id);
  return { byId, visibleIds }
}

export default class Catalog {
  constructor(products = []) {
    const { byId, visibleIds } = arrangeProducts(products)
    this.byId = byId
    this.visibleIds = visibleIds
    this.getProduct = this.getProduct.bind(this)
  }

  getProduct(id) {
    return this.byId[id]
  }

  hasStock(id) {
    const product = this.getProduct(id)
    return product && product.inventory > 0
  }

  getVisibleProducts() {
    return this.visibleIds.map(this.getProduct)
  }

  pickup(id) {
    const product = this.byId[id]
    const nextProduct = product && {
      ...product,
      inventory: product.inventory - 1
    }
    this.byId[id] = nextProduct
    return nextProduct
  }

  takeSnapshot() {
    const { byId, visibleIds } = this
    return {
      visibleIds,
      byId: { ...byId }
    }
  }
}
