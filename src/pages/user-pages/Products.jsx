import React, { useState, useEffect, useCallback } from "react";
import { useProducts } from "../../hooks/useProducts";
import { NavLink } from "react-router-dom";
import placeholder from "../../../public/placeholder.webp";
import { Eye, ShoppingCart } from "lucide-react";
import Loader from "../../utils/Loader";
import { useAddToCart } from "../../hooks/useCart.js";
import { useAuth } from "../../contexts/AuthContext";
import { handleAddToCart } from "../../utils/AddToCartFun.jsx";

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const limit = 12;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isError, error } = useProducts({
    page: currentPage,
    limit,
    active: true,
    keyword: debouncedSearch,
    min: priceRange.min,
    max: priceRange.max,
  });

  const products = data?.data || [];
  const pagination = data?.pagination || {};
  const totalPages = pagination.totalPages || 1;
  const totalProducts = pagination.total || 0;

  // Auth and cart hooks
  const { user } = useAuth();
  const { mutateAsync: addToCart, isPending } = useAddToCart();
  const userId = user?.id;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Page reset is handled in the debounce effect
  };

  const handlePriceFilter = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setPriceRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  // Handle add to cart with better error handling
  const onAdd = async (productId) => {
    if (!userId) {
      // Handle case where user is not logged in
      // You might want to redirect to login or show a modal
      return;
    }

    try {
      await handleAddToCart({
        productId,
        userId,
        quantity: 1,
        addToCartMutation: addToCart,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Error is already handled in the hook, but you can add additional logic here
    }
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            All Products
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 mainProductPageDiv">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-72 bg-white rounded-lg shadow-md p-6 lg:sticky top-4 self-start">
          <h2
            className="font-semibold text-gray-800 mb-6"
            style={{ fontSize: "24px" }}
          >
            Filter Products
          </h2>

          {/* Search Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && searchQuery !== debouncedSearch && (
              <p className="text-xs text-gray-500 mt-1">Searching...</p>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="mb-6 mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handlePriceFilter}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors my-3"
            >
              Apply
            </button>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Clear Filters
          </button>
        </aside>

        {/* Product Listing Grid and Pagination */}
        <main className="p-6 flex-1">
          <div className="flex justify-between items-center mb-0">
            <p>
              Showing {products.length} of {totalProducts} products
            </p>
            {searchQuery && (
              <p className="text-sm text-gray-500">
                Searching for "{searchQuery}"...
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found</p>
              {(searchQuery || priceRange.min || priceRange.max) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-indigo-600 hover:text-indigo-700"
                >
                  Clear filters to see all products
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="border rounded p-2 lg:p-4 shadow text-center"
                >
                  <img
                    src={product.image || placeholder}
                    alt={product.name}
                    className="w-full h-48 object-cover mb-2"
                    loading="lazy" // Add lazy loading for better performance
                  />
                  <div className="p-6">
                    <h3 className="lg:text-xl font-semibold text-gray-800 mb-2 overflow-hidden text-ellipsis">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between flex-col items-center">
                      <div className="flex justify-center lg:justify-center flex-col lg:flex-row items-center mb-3 w-full">
                        <span className="text-xl font-bold text-indigo-600">
                          ₹{product.sellPrice}.00
                        </span>
                        {product.regularPrice > product.sellPrice && (
                          <span className="text-md mx-2 font-bold text-gray-400 line-through decoration-2">
                            ₹{product.regularPrice}.00
                          </span>
                        )}
                      </div>
                      <div className="flex justify-center align-middle gap-3 w-full flex-col lg:flex-row pb-3">
                        <button
                          className="bg-indigo-600 text-white px-3 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1 rounded-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => onAdd(product._id)}
                          // disabled={isPending || !userId}
                          style={{ fontSize: "11px" }}
                        >
                          <ShoppingCart size={10} /> Add to Cart
                        </button>
                        <NavLink
                          to={`/product-detail/${product._id}`}
                          className="bg-indigo-600 text-white px-3 text-center py-2 rounded-sm text-[11px] font-medium hover:bg-indigo-700 transition-colors flex justify-center items-center gap-1"
                        >
                          <Eye size={12} /> View Product
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && products.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded ${
                    index + 1 === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-white border hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
