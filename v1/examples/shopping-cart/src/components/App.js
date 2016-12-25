import React from 'react';
import CartContainer from './CartContainer';
import ProductListContainer from './ProductListContainer';

const App = () => (
  <div>
    <h2>Shopping Cart Example</h2>
    <CartContainer />
    <hr/>
    <ProductListContainer title="Products" />
    <hr/>
  </div>
);


export default App;
