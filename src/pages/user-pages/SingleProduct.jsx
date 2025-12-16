import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSingleProduct } from "../../hooks/useProducts.js";
import Loader from "../../utils/Loader.jsx";
import placeholder from "../../../public/300x200.svg";
import { useAddToCart } from "../../hooks/useCart.js";
import { useAuth } from "../../contexts/AuthContext";
import { handleAddToCart } from "../../utils/AddToCartFun.jsx";
import Review from "./Review.jsx";
import AddReview from "./AddReview.jsx";
// Mock related products data
const relatedProducts = [
  {
    id: 2,
    name: "Comfortable Sweatpants",
    price: 39.99,
    image: "https://placehold.co/300x400/add8e6/000?text=Sweatpants",
    rating: 4.3,
    reviews: 90,
  },
  {
    id: 3,
    name: "Crew Neck T-Shirt",
    price: 19.99,
    image: "https://placehold.co/300x400/90ee90/000?text=T-Shirt",
    rating: 4.5,
    reviews: 150,
  },
  {
    id: 4,
    name: "Sporty Cap",
    price: 15.0,
    image: "https://placehold.co/300x400/ffc0cb/000?text=Cap",
    rating: 4.0,
    reviews: 70,
  },
  {
    id: 5,
    name: "Denim Jacket",
    price: 89.99,
    image: "https://placehold.co/300x400/a7c3d4/000?text=Denim+Jacket",
    rating: 4.6,
    reviews: 110,
  },
];
const SingleProduct = () => {
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  // Handle Add to cart
  const { user } = useAuth(); // Get logged-in user from context
  const { mutateAsync: addToCart, isPending } = useAddToCart();
  // My Code
  const { id } = useParams();
  const {
    data: responseData,
    isLoading,
    isError,
    error,
  } = useSingleProduct(id);

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="text-center text-red-500 font-semibold py-10">
        Error: {error.message}
      </div>
    );

  const product = responseData.data;

  // Helper function for star rating display
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="text-yellow-500">
          ⭐
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-500">
          ⭐
        </span>
      ); // Using full star for simplicity for half
    }
    return stars;
  };

  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      if (type === "inc") return prev + 1;
      if (type === "dec") return prev > 1 ? prev - 1 : 1; // prevent going below 1
      return prev;
    });
  };

  // Handle Add to cart
  const userId = user?.id;
  const onAdd = (id) => {
    handleAddToCart({
      productId: id,
      userId,
      quantity: quantity,
      addToCartMutation: addToCart,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10 lg:pt-2 pb-5">
        {/* Breadcrumbs (optional) */}
        <nav className="text-sm text-gray-600 py-2 mb-2 lg:px-5 lg:mx-2">
          <a href="#" className="hover:underline">
            Home
          </a>{" "}
          &gt;{" "}
          <a href="#" className="hover:underline">
            {product.brand}
          </a>{" "}
          &gt; <span className="font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-5  ">
          {/* Product Image Gallery */}
          <div className="flex flex-col items-center">
            <img
              src={product.image || placeholder}
              alt={product.name}
              className="w-full max-w-lg h-auto rounded-lg shadow-md object-cover mb-4"
            />
            <div className="flex space-x-2 overflow-x-auto p-2">
              {product.additionalImages.length === 0 ? (
                <img
                  src={placeholder}
                  alt={product.name}
                  className="w-20 h-20 rounded mx-2"
                />
              ) : (
                product.additionalImages.map((img, index) => (
                  <div key={index + 1} className="flex flex-wrap">
                    <img
                      key={index + 1}
                      src={img.url}
                      alt={`${product.name} ${img.publicId}`}
                      className={`object-cover rounded-md cursor-pointer border-2 mx-2 my-2`}
                      style={{ width: "100px" }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h2>
            {/* Rating and Reviews */}
            <div className="flex items-center mb-1">
              <div className="flex text-yellow-500">
                {renderStars(product.rating)}
              </div>
              <span className="ml-2 text-gray-600 text-sm">
                ({product.reviews || 0} Start Review)
              </span>
            </div>
            <p className="text-4xl font-extrabold text-gray-900 mb-2  ">
              <span className="single__productPage_regularPrice text-3xl font-medium">
                {" "}
                ₹ {product.regularPrice}
              </span>
              <span className="single__productPage__sellPrice text-xl font-medium line-through decoration-2 text-gray-400 mx-2">
                {" "}
                ₹ {product.sellPrice}
              </span>
            </p>
            <p
              className={`p-0 mt-0 ${
                product.quantity == 0 ? "text-red-500" : "text-green-600"
              }`}
            >
              Quantity : {product.quantity}
            </p>
            <hr />
            {/* Description */}
            <h5 className="text-md font-semibold text-gray-800 mb-2">
              Product Details:
            </h5>
            <h6 className="fw-bold">Description</h6>
            <p className="text-gray-700 leading-relaxed mb-6">
              {product.description}
            </p>
            <h6 className="fw-bold">Categories</h6>
            <ul className="p-0 m-0 text-md font-semibold text-gray-800 mb-4 flex justify-start gap-2">
              {product.categories.map((cat, index) => (
                <li key={cat._id || index} className="text-gray-500">
                  <p className="">{cat.name || cat}</p>
                </li>
              ))}
            </ul>
            <hr className="" />

            {/* Quantity Selector and Add to Cart */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="quantitySelect px-2">
                <button
                  className="bg-gray-300 w-25 rounded-0 py-2"
                  onClick={() => handleQuantityChange("dec")}
                >
                  -
                </button>
                <input
                  type="text"
                  className="w-50 text-center border-1 outline-0 py-2"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <button
                  className="bg-gray-300 w-25 rounded-0 py-2"
                  onClick={() => handleQuantityChange("inc")}
                >
                  +
                </button>
              </div>
              <button
                className="flex-1 py-2 px-4 bg-blue-600 text-white font-semibold rounded-1 hover:opacity-95"
                onClick={() => onAdd(product._id)}
              >
                {isPending ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        <div className="single-page-all-review">
          <Review pid={id} />
        </div>

        <div className="single-page-add-review mt-5">
          <AddReview pid={id} />
        </div>

        {/* Related Products Section */}
        <div className="mt-12 border-t border-gray-200 pt-5">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center pb-5">
            You might also like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
              >
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-36 lg:h-48 object-cover"
                />
                <div className="p-2 lg:p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {relatedProduct.name}
                  </h3>
                  <div className="flex items-center flex-col lg:flex-row mt-2">
                    <span className="text-yellow-500 w-[100%]">
                      {"⭐".repeat(Math.floor(relatedProduct.rating))}
                    </span>
                    <span className="ml-2 text-gray-600 text-sm w-[100%]">
                      ({relatedProduct.reviews} reviews)
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 mt-3">
                    ${relatedProduct.price.toFixed(2)}
                  </p>
                  <button className="mb-3 lg:mb-0 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
