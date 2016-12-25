import shop from '../../api/shop';

export const loadProducts = ({ mutations }) => {
  shop.fetchProducts(products => {
    mutations.initialize(products);
  });
};
