
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, SortAsc, SortDesc } from "lucide-react";
import { Link } from "react-router-dom";
import { categories, getProductsByCategory, products } from "@/services/mockData";
import { Category, Product } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const CategoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = parseInt(id || "0");
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();

  useEffect(() => {
    // Find the category and related products
    setIsLoading(true);
    const foundCategory = categories.find(cat => cat.id === categoryId);
    
    if (foundCategory) {
      setCategory(foundCategory);
      const categoryProducts = getProductsByCategory(categoryId);
      setProducts(categoryProducts);
      
      if (categoryProducts.length === 0) {
        toast({
          title: "No products found",
          description: `There are currently no products available in the ${foundCategory.name} category.`,
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Category not found",
        description: "The category you're looking for doesn't exist.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  }, [categoryId, toast]);

  // Sort products by price
  const sortProducts = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    
    const sortedProducts = [...products].sort((a, b) => {
      return newOrder === "asc" ? a.price - b.price : b.price - a.price;
    });
    
    setProducts(sortedProducts);
    
    toast({
      title: "Products sorted",
      description: `Products are now sorted by price (${newOrder === "asc" ? "lowest to highest" : "highest to lowest"}).`
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-sm mb-6 text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to home
        </Link>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : category ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
              <p className="text-muted-foreground">{category.description}</p>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-muted-foreground">
                Showing {products.length} products
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={sortProducts}>
                  {sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4 mr-2" />
                  ) : (
                    <SortDesc className="h-4 w-4 mr-2" />
                  )}
                  Price {sortOrder === "asc" ? "Low to High" : "High to Low"}
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  We currently don't have any products in this category.
                </p>
                <Button asChild>
                  <Link to="/products">Browse all products</Link>
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Category Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The category you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link to="/">Go back to home</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryDetail;
