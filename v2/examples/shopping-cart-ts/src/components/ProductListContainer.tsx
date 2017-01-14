import * as React from 'react';
import connect, { Methods } from '../connect';
import ProductItem from './ProductItem';
import { Product } from '../types';

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

const mapToProps = (methods: Methods, props: ContainerProps): ProductListProps => ({
    products: methods.getVisibleProducts(),
    addToCart: methods.addToCart,
    title: props.title
})

const ProductListContainer = connect(mapToProps)(ProductList);

export default ProductListContainer;
