import React, { PropTypes } from 'react';
import ProductItem from './ProductItem';
import { commands } from '../dispatcher';
import { getVisibleProducts } from '../stores/products/accessors';
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

const mapStateToProps = (query, { products }, props) => ({
  products: query(products, getVisibleProducts),
  ...props,
});

const mapDispatchToProps = dispatch => ({
  addToCart: id => dispatch(commands.addToCart, id),
});

const ProductListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductList);

export default ProductListContainer;
