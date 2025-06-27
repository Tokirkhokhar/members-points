"use client";

import { Product } from "@/types/product";
import { ProductCard } from "./product-card";

const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    sku: "WBH-001",
    price: 99.99,
    brandName: "TechSound",
    category: "Electronics",
    description:
      "Premium wireless headphones with noise cancellation and 30-hour battery life.",
    image:
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500",
    customAttributes: [
      { key: "color", value: "Black" },
      { key: "warranty", value: "2 years" },
    ],
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    sku: "SFW-002",
    price: 249.99,
    brandName: "FitTech",
    category: "Electronics",
    description:
      "Advanced fitness tracking with heart rate monitor, GPS, and 7-day battery life.",
    image:
      "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500",
    customAttributes: [
      { key: "color", value: "Silver" },
      { key: "waterproof", value: "Yes" },
    ],
  },
  {
    id: "3",
    name: "USB-C Hub",
    sku: "UCH-005",
    price: 59.99,
    brandName: "ConnectPro",
    category: "Electronics",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader.",
    image:
      "https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=500",
    customAttributes: [
      { key: "ports", value: "7" },
      { key: "compatibility", value: "MacBook, PC" },
    ],
  },
];

export function ProductGrid() {
  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dummyProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
