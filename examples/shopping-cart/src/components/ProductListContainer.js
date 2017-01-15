import React, { PropTypes } from 'react';
import ProductItem from './ProductItem';
import connect from '../connect';

const ProductList = ({ title, products, addToCart }) => (
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

ProductList.propTypes = {
  title: PropTypes.string.isRequired,
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    inventory: PropTypes.number.isRequired,
  })).isRequired,
  addToCart: PropTypes.func.isRequired,
};

const mapToProps = (facade, _, props) => ({
  products: facade.products,
  addToCart: facade.addToCart,
  title: props.title,
});

const ProductListContainer = connect(mapToProps)(ProductList);

export default ProductListContainer;
