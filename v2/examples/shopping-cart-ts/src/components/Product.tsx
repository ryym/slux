import * as React from 'react';

interface ProductProps {
    title: string;
    price: number;
    quantity: number;
}

const Product = ({ price, quantity, title }: ProductProps) => (
    <div>
        {title} - &#36;{price}{quantity ? ` x ${quantity}` : null}
    </div>
);

export default Product;
