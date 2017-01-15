export default class Cart {
  constructor() {
    this.reset()
  }

  getQuantity(productId) {
    return this.quantityById[productId]
  }

  getAddedIds() {
    return this.addedIds
  }

  isInCart(productId) {
    return this.addedIds.indexOf(productId) >= 0
  }

  addProduct(productId) {
    if (! this.isInCart(productId)) {
      this.addedIds = this.addedIds.concat(productId)
      this.quantityById[productId] = 0
    }
    this.quantityById[productId] += 1
  }

  getContent() {
    return {
      addedIds: this.addedIds,
      quantityById: this.quantityById
    }
  }

  setContent({ addedIds, quantityById }) {
    this.addedIds = addedIds
    this.quantityById = quantityById
  }

  reset() {
    this.setContent({ addedIds: [], quantityById: [] })
    return this
  }

  takeSnapshot() {
    const { addedIds, quantityById } = this
    return {
      addedIds,
      quantityById: { ...quantityById }
    }
  }
}
