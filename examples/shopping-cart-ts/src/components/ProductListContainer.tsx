import * as React from 'react';
import { CustomQuery } from 'slux/react';
import connect, { Stores } from '../connect';
import ProductItem from './ProductItem';
import { commands } from '../dispatcher';
import { getVisibleProducts } from '../stores/products/accessors';
import { Product } from '../types';
import { Dispatch } from 'slux';

interface ProductListProps {
    title: string;
    products: Product[];
    addToCart: (id: number) => void;
}

interface ContainerProps {
    title: string;
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

const mapStateToProps = (query: CustomQuery, { products }: Stores, props: ContainerProps) => ({
    products: query(products, getVisibleProducts),
    ...props,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    addToCart: (id: number) => dispatch(commands.addToCart, id),
});

const ProductListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductList);

export default ProductListContainer;
