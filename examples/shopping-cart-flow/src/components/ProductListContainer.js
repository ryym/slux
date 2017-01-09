// @flow

import React from 'react';
import type { ConnectedComponentClass } from 'slux/react';
import connect from '../connect';
import ProductItem from './ProductItem';
import type { Product } from '../types';

interface ProductListProps {
  title: string;
  products: Product[];
  addToCart: (id: number) => void;
}

const ProductList = ({ title, products, addToCart }: ProductListProps) => (
  <div>
    <h3>{title}</h3>
    {products.map(product =>
      <ProductItem
        key={product.id}
        product={product}
        onAddToCartClicked={() => addToCart(product.id)}
      />
    )}
  </div>
);

interface ContainerProps {
  title: string;
}

const mapToProps = (methods, props): ProductListProps => ({
  products: methods.getVisibleProducts(),
  addToCart: methods.addToCart,
  title: props.title,
});

const ProductListContainer: ConnectedComponentClass<ContainerProps> = connect(
  mapToProps,
)(ProductList);

export default ProductListContainer;
