export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  brandName: string;
  category: string;
  description: string;
  image: string;
  customAttributes: Array<{
    key: string;
    value: string;
  }>;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
