import _products from './products';
import { Product } from '../types';

export interface ShopAPI {
    fetchProducts(callback: (ps: Product[]) => void): void;
    buyProducts(products: Product[], callback: (err?: Error) => void): void;
}

const shopAPI: ShopAPI = {
    fetchProducts: (callback) => {
        setTimeout(() => callback(_products), 100);
    },
    buyProducts: (products, callback) => {
        setTimeout(() => callback(), 100);
    }
};

export default shopAPI;
