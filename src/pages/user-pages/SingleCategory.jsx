// pages/SingleCategory.jsx
import React, { useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { useSearchProducts } from "../../hooks/useSearchProducts";
import Loader from "../../utils/Loader";
import placeholder from "../../../public/300x200.svg";
import { Eye, ShoppingCart } from "lucide-react";
import { useCategory } from "../../hooks/useCategories.js";
import { handleAddToCart } from "../../utils/AddToCartFun.jsx";
import { useAddToCart } from "../../hooks/useCart.js";
import { useAuth } from "../../contexts/AuthContext";

const SingleCategory = () => {
  const { id: categoryId } = useParams();
  const [page, setPage] = useState(1);
  const limit = 12;
  // handle  add to cart
  const { user } = useAuth(); // Get logged-in user from context
  const { mutateAsync: addToCart, isPending } = useAddToCart();
  const userId = user?.id;
  const {
    data: searchData,
    isLoading: isProductLoading,
    isError,
    error,
  } = useSearchProducts({
    category: categoryId,
    page,
    limit,
  });

  const { data: categoryData, isLoading: loadingCategory } =
    useCategory(categoryId);

  const products = searchData?.data || [];
  const pagination = searchData?.pagination || {};
  const totalPages = pagination.totalPages || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  if (isProductLoading || loadingCategory) return <Loader />;
  if (isError)
    return (
      <div className="text-center text-red-500 font-medium py-10">
        Error: {error.message}
      </div>
    );

  const onAdd = (id) => {
    handleAddToCart({
      productId: id,
      userId,
      quantity: 1,
      addToCartMutation: addToCart,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter singleCategoryPage">
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl fs-5 font-bold text-gray-900 text-center uppercase">
            Products in Category: {categoryData.data.name || "N/A"}
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 py-5">
        {products.length === 0 ? (
          <div className="text-center text-gray-600 text-xl py-10">
            No products in this category yet.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div
                  key={product._id}
                  id={`category-${product.name}+${index + 1}`}
                  className="border rounded p-2 lg:p-4 shadow text-center"
                >
                  <img
                    src={product.image || placeholder}
                    alt={product.name}
                    className="w-full h-48 object-contain mb-2"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2" style={{whiteSpace: "nowrap",overflow: "hidden",textOverflow: "ellipsis"}}>
                      {product.description}
                    </p>
           
                    <div className="flex justify-center items-center mb-3">
                      <span className="text-xl font-bold text-indigo-600 mx-2">
                        ₹{product.sellPrice}
                      </span>
                      <span className="text-gray-400 line-through mx-2">
                        ₹{product.regularPrice}
                      </span>
                    </div>
                    <div className="flex gap-2 justify-center pb-3">
                      <button
                        className="bg-indigo-600 text-white px-3 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1 rounded-1"
                        onClick={() => onAdd(product._id)}
                        style={{ fontSize: "11px" }}
                      >
                        <ShoppingCart size={10} /> Add to Cart
                      </button>
                      <NavLink
                        to={`/product-detail/${product._id}`}
                        className="bg-indigo-600 text-white px-3 py-2 rounded-sm text-[11px] font-medium hover:bg-indigo-700 flex items-center gap-1"
                      >
                        <Eye size={12} /> View
                      </NavLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 rounded ${
                      index + 1 === page
                        ? "bg-blue-600 text-white"
                        : "bg-white border"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default SingleCategory;
