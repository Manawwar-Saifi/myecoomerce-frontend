import React from "react";
import { useAllCategories } from "../../hooks/useCategories.js";
import Loader from "../../utils/Loader";
import placeholder from "../../../public/300x200.svg";
import { NavLink } from "react-router-dom";
import { Eye } from "lucide-react";
const Category = () => {
  const { data: categories, isLoading } = useAllCategories();
  console.log(categories);

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">Our Categories</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-5">
        {isLoading ? (
          <Loader />
        ) : categories.length === 0 ? (
          <p className="col-span-full text-center">No categories found.</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg"
            >
              <div className="w-full flex justify-center p-3">
              <img
                src={cat.image || placeholder}
                alt={cat.name}
                className="w-50 object-cover"
              />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold capitalize text-center">{cat.name}</h3>
                <p className="text-gray-600 text-sm">{cat.description}</p>
                <div className="flex align-middle justify-center mt-3">
                  <NavLink
                    to={`/category-single/${cat._id}`}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-full text-[11px] font-medium hover:bg-indigo-700 transition-colors mx-auto mt-2 flex align-middle justify-between gap-2 "
                  >
                    <Eye size={12} style={{ marginTop: "3px" }} />
                    View All
                  </NavLink>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Category;
