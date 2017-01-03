// @flow

import React from 'react';
import Product from './Product';
import { CartProduct } from '../types';

interface CartProps {
  products: CartProduct[];
  total: number;
  checkout: (products: CartProduct[]) => void;
}

const Cart = ({ products, total, checkout }: CartProps) => {
  const hasProducts = products.length > 0;
  const nodes = hasProducts ? (
    products.map(product =>
      <Product
        title={product.title}
        price={product.price}
        quantity={product.quantity}
        key={product.id}
      />
    )
  ) : (
    <em>Please add some products to cart.</em>
  );

  return (
    <div>
      <h3>Your Cart</h3>
      <div>{nodes}</div>
      <p>Total: &#36;{total.toFixed(2)}</p>
      <button
        onClick={() => checkout(products)}
        disabled={!hasProducts}
      >
        Checkout
      </button>
    </div>
  );
};

export default Cart;
