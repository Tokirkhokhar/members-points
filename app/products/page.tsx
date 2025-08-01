import { ProtectedRoute } from "@/components/auth/protected-route";
import { ProductGrid } from "@/components/products/product-grid";

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <div className="container p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Welcome to Loyalty Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Shop our exclusive products and earn points with every purchase
          </p>
        </div>
        <ProductGrid />
      </div>
    </ProtectedRoute>
  );
}
