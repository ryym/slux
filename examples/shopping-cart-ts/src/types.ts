export interface Product {
    id: number;
    title: string;
    price: number;
    inventory: number;
}

export interface CartProduct extends Product {
    quantity: number;
}
