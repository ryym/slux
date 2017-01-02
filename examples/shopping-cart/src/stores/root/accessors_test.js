import test from 'ava';
import { mockCombinedQuery } from 'slux/testutils';
import { getProduct } from '../products/accessors';
import { getAddedIds, getQuantity } from '../cart/accessors';
import { getCartProducts } from './accessors';

const stores = {
  cart: 'CART',
  products: 'PRODUCTS',
  self: 'SELF',
};

test('getCartProduct', t => {
  const makeMockProduct = id => ({
    id,
    title: `Product-${id}`,
    price: id * 100,
    inventory: id,
  });
  const query = mockCombinedQuery()
    .define(stores.cart, [
      [getAddedIds, [1, 2]],
      [getQuantity, id => id + 10],
    ])
    .define(stores.products, [
      [getProduct, makeMockProduct],
    ]);

  const products = getCartProducts.exec(undefined, { query, stores });

  t.deepEqual(products, [{
    id: 1,
    title: 'Product-1',
    price: 100,
    inventory: 1,
    quantity: 11,
  }, {
    id: 2,
    title: 'Product-2',
    price: 200,
    inventory: 2,
    quantity: 12,
  }]);
});
