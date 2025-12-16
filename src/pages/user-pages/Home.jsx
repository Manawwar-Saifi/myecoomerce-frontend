import { useState } from "react";
import banner from "../../assets/BedBanners.jpg";
import banner2 from "../../assets/banner2.webp";
import Loader from "../../utils/Loader";
import { NavLink } from "react-router-dom";
import { useAllCategories } from "../../hooks/useCategories.js";
import { useProducts } from "../../hooks/useProducts.js";
import {
  ShoppingCart,
  Laptop,
  Shirt,
  Book,
  Utensils,
  Sofa,
  Gem,
  Eye,
} from "lucide-react";
import placeholder from "../../../public/placeholder.webp";
import placeholder2 from "../../../public/300x200.svg";
import { useAddToCart } from "../../hooks/useCart.js";
import { useAuth } from "../../contexts/AuthContext";
import { handleAddToCart } from "../../utils/AddToCartFun.jsx";

const Home = () => {
  const { user } = useAuth(); // ✅ Call hooks at top level
  const { mutateAsync: addToCart, isPending } = useAddToCart();

  const limit = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const { data: categories, isLoading: categoryLoading } = useAllCategories(); // ✅ Hook moved before early returns
  const { data, isLoading, isError, error } = useProducts({
    page: currentPage,
    limit,
    active: true,
  });

  const products = data?.data || [];
  const pagination = data?.pagination || {};
  const userId = user?.id;

  // ✅ Early return only after all hooks are called
  if (categoryLoading)
    return (
      <div className="text-center">
        <Loader />
      </div>
    );

  if (isError)
    return <div className="text-red-500">Error: {error.message}</div>;

  const onAdd = (id) => {
    handleAddToCart({
      productId: id,
      userId,
      quantity: 1,
      addToCartMutation: addToCart,
    });
  };
  return (
    <>
      <div className="home-page">
        {/* Banner or Hero Section */}
        <div
          id="carouselExampleAutoplaying"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={banner} className="d-block w-100" alt="Banner" />
            </div>
            <div className="carousel-item">
              <img
                src="https://nestloom.in/cdn/shop/files/Artboard_4.webp?v=1746246593&width=1800"
                className="d-block w-100"
                alt="Banner"
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://nestloom.in/cdn/shop/files/Artboard_4.webp?v=1746246593&width=1800"
                className="d-block w-100"
                alt="Banner"
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        <section className="sectionMainHomePage">
          <div className="container afterHeroSection">
            <div className="row">
              <div className="col-12">
                <div className="min-h-screen bg-gray-100 font-sans antialiased pb-5 innerDiv">
                  {/* Shop by Category Section */}
                  <section className="py-12 px-6 md:px-10 lg:px-16 py-5 categorySection">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center mb-4">
                      Shop by Category
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                      {/* Category Card 1: Electronics */}
                      {isLoading ? (
                        <Loader />
                      ) : categories.length === 0 ? (
                        <p className="col-span-full text-center">
                          No categories found.
                        </p>
                      ) : (
                        categories.slice(0, ).map((cat) => (
                          <div key={cat._id}>
                            <NavLink
                              to={`category/${cat._id}`}
                              className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md transform transition-transform hover:scale-105 duration-300 text-indigo-600 hover:text-indigo-700"
                            >
                              <img
                                src={cat.image || placeholder2}
                                alt={cat.name}
                                className="h-24 w-full object-contain mb-2 rounded-xl "
                              />
                              <div className="">
                                <h6 className="text-sm text-black font-bold text-center">
                                  {cat.name}
                                </h6>
                              </div>
                            </NavLink>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex align-middle justify-center mt-3">
                      <NavLink
                        to={`/category`}
                        className="bg-indigo-600 text-white px-3 py-2 rounded-full text-[11px] font-medium hover:bg-indigo-700 transition-colors mx-auto mt-2"
                      >
                        View All
                      </NavLink>
                    </div>
                  </section>

                  {/* Featured Products */}
                  <section className="py-12 px-6 md:px-10 lg:px-16 featuredSection">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                      Featured Products
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-8">
                      {products.slice(0, 4).map((product) => (
                        <div
                          key={product._id}
                          className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform hover:scale-105 duration-300"
                        >
                          <img
                            src={product.image || placeholder}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = placeholder;
                            }}
                          />
                          <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                              {product.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                              {product.description}
                            </p>
                            <div className="flex justify-between items-center">
                              <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-indigo-600">
                                  ₹{product.sellPrice}.00
                                </span>
                                <span className="text-md mx-2 font-bold text-gray-300 line-through decoration-2">
                                  ₹{product.regularPrice}.00
                                </span>
                              </div>
                              <div className="flex justify-between align-middle gap-3">
                                <button
                                  className="bg-indigo-600 text-white px-3 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1 rounded-1"
                                  onClick={() => onAdd(product._id)}
                                  style={{ fontSize: "11px" }}
                                >
                                  <ShoppingCart size={10} />
                                  Add to Cart
                                </button>
                                <NavLink
                                  to={`product-detail/${product._id}`}
                                  className="bg-indigo-600 text-white px-3 py-2 rounded-sm text-[11px] font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1"
                                >
                                  <Eye size={12} /> View Product
                                </NavLink>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*  Banner Section  */}

        <section className="bannerSection">
          <img src={banner2} alt="Banner2" />
        </section>

        {/* New Arrival Product Section  */}
        <section className="newArrivalsProductHome">
          <div className="container">
            <div className="row">
              <div className="col-12">
                {/* Product Display Section */}
                <section className="py-12 px-6 md:px-10 lg:px-16 featuredSection">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    New Arrivals
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-8">
                    {/* product cart new arrivals */}
                    {products.slice(0, 4).map((product) => (
                      <div
                        className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform hover:scale-105 duration-300"
                        key={product._id}
                      >
                        <img
                          src={product.image || placeholder}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = placeholder;
                          }}
                        />
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex justify-between items-center">
                              <span className="text-xl font-bold text-indigo-600">
                                ₹{product.sellPrice}.00
                              </span>
                              <span className="text-md mx-2 font-bold text-gray-300 line-through  decoration-2">
                                ₹{product.regularPrice}.00
                              </span>
                            </div>
                            <div className="flex justify-between align-middle gap-3">
                              <button
                                className={`bg-indigo-600 text-white px-3 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1 rounded-1`}
                                onClick={() => onAdd(product._id)}
                                style={{ fontSize: "11px" }}
                              >
                                <ShoppingCart size={10} /> Add to Cart
                              </button>
                              <NavLink
                                to={`product-detail/${product._id}`}
                                value={product._id}
                                className="bg-indigo-600 text-white px-3 py-2 rounded-sm text-[11px] font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1"
                              >
                                <Eye size={12} /> View Product
                              </NavLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
