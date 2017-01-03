// @flow

import React from 'react';
import type { CustomQuery, ConnectedComponentClass } from 'slux/react';
import connect from '../connect';
import type { Stores } from '../connect';
import ProductItem from './ProductItem';
import { commands } from '../dispatcher';
import { getVisibleProducts } from '../stores/products/accessors';
import type { Product } from '../types';
import type { Dispatch } from 'slux';

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

const mapStateToProps = (query: CustomQuery, { products }: Stores, props: ContainerProps) => ({
  products: query(products, getVisibleProducts),
  ...props,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addToCart: (id: number) => dispatch(commands.addToCart, id),
});

const ProductListContainer: ConnectedComponentClass<ContainerProps> = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductList);

export default ProductListContainer;
