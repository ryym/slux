// メソッドのunit testがどんな感じに書けるかのチェック

require('babel-register')
const assert = require('assert')
const {
  getQuantity,
  getCurrentCart,
  getAddedIds,
  startCheckout,
  finishCheckout,
  checkout,

  checkCartStore,
  checkRootStoreProducts,
  checkDispatcher
} = require('./tsc-dist/user')

const test = (title, body) => {
  try {
    body()
    console.log('OK:', title)
  } catch (e) {
    console.error('[ERR:]', title, e)
  }
}

// ========================================

test('run stores', () => {
  console.log('-------- TEST RUN --------')
  checkCartStore()
  checkRootStoreProducts()
  checkDispatcher()
  console.log('-------- TEST RUN OK --------')
})

test('getQuantity', () => {
  const state = { quantityById: { 1: 2 } }
  const quantity = getQuantity(state, {}, 1)
  assert.equal(quantity, 2)
})

// XXX: 実際には非同期のactionなので、waitできるutilがいる
test('checkout', () => {
  const query = (method, payload) => {
    switch(method) {
      case getCurrentCart:
        return { current: true }
      case getAddedIds:
        return [1, 2, 3]
    }
  }

  mutationCalls = { start: 0, finish: 0 }
  const commit = (method, payload) => {
    switch (method) {
      case startCheckout:
        return mutationCalls.start += 1
      case finishCheckout:
        return mutationCalls.finish += 1
    }
  }

  let _boughtIds
  const shop = {
    buyProducts: (ids, callback) => {
      _boughtIds = ids
      callback()
    }
  }

  checkout.with(shop)({ query, commit })

  assert.deepEqual(_boughtIds, [1, 2, 3])
  assert.deepEqual(mutationCalls, { start: 1, finish: 1 })
})

