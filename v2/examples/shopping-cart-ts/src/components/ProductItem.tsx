import * as React from 'react';
import Product from './Product';
import { Product as ProductType } from '../types';

interface ProductItemProps {
    product: ProductType;
    onAddToCartClicked: (event: any) => void;
}

const ProductItem = ({ product, onAddToCartClicked }: ProductItemProps) => (
    <div style={{ marginBottom: 20 }}>
        <Product
            title={product.title}
            price={product.price}
            quantity={product.inventory}
        />
        <button
            onClick={onAddToCartClicked}
            disabled={product.inventory === 0}
        >
            {product.inventory > 0 ? 'Add to cart' : 'Sold Out'}
        </button>
    </div>
);

export default ProductItem;
