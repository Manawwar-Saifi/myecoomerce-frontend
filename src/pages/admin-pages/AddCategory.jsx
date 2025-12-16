import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "../../components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import dummyImage from "../../assets/2149635272.webp";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import Switch from "@mui/material/Switch";
import Loader from "../../utils/Loader.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { showSuccess, showError } from "../../utils/Toasty.jsx";
const AddCategory = () => {
  const queryClient = useQueryClient();
  // State for form fields (General Tab)
  const [name, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [image, setImage] = useState(""); // To store the image preview URL
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // ✅ real file for FormData
      setImage(URL.createObjectURL(file)); // Update the image preview URL
    }
  };

  const navigate = useNavigate();
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("isActive", isActive == "active" ? true : false);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    try {
      const res = await fetch(`http://localhost:8000/api/category/add`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Add Category failed.");

      showSuccess("Category Added successfully.");

      navigate("/admin/categories");
      queryClient.invalidateQueries({ queryKey: ["add-category"] });
      queryClient.invalidateQueries({ queryKey: ["all-categories"] });
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="add-category-page-div">
      <div className="adminAddProductPage">
        <section className="section1 shadow-md rounded-md py-2 mb-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-8">
                <Link to="/admin/categories">
                  <Button
                    variant="outline"
                    className="mx-2 cursor-pointer hover:opacity-75"
                  >
                    <ArrowBackIcon fontSize="small" />
                  </Button>
                  Add New Category
                </Link>
              </div>
              <div className="col-4">
                <div className="innerDiv flex align-middle justify-around">
                  <span className="rounded-md border-2 border-red-700 h-auto w-10 flex align-middle justify-center cursor-pointer hover:opacity-75 hover:bg-red-200 mx-2 px-2">
                    <DeleteIcon
                      fontSize="small"
                      className="text-red-700 h-100 mx-auto"
                    />
                  </span>
                  <Button variant="outline" className="mx-3">
                    Save Draft
                  </Button>
                  <Button className="cursor-pointer hover:opacity-75">
                    Publish
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section2">
          <div className="container-fluid shadow-md rounded-md py-2">
            <div className="row">
              <div className="col-lg-5 col-sm-12 leftDiv">
                <div className="row">
                  {/* Cover Image */}
                  <div className="col-10 coverImage">
                    <div className="innerdiv">
                      <div className="fileChossene">
                        <label
                          htmlFor="file-upload"
                          className="custom-file-upload"
                        >
                          Select Category Image
                        </label>
                        <input
                          type="file"
                          id="file-upload"
                          accept="image/*"
                          onChange={handleImageChange} // Handle file selection
                        />
                        {image && (
                          <div className="mt-2">
                            <img
                              src={image}
                              alt="Preview"
                              className=""
                              style={{ width: "20%", height: "auto" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-7 col-sm-12 rightDiv">
                <div className="innerDiv">
                  <div className="">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl md:p-8">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h4 className="text-2xl font-bold text-gray-800">
                            Category Details
                          </h4>
                        </div>
                      </div>

                      <form
                        className="space-y-6 addProductFrom"
                        onSubmit={handleUpdateSubmit}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Category Name */}
                          <div>
                            <label
                              htmlFor="productName"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Category Name{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="productName"
                              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="category name"
                              value={name}
                              onChange={(e) => setCategoryName(e.target.value)}
                            />
                          </div>
                          {/* Category Status */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Status <span className="text-red-500">*</span>
                            </label>

                            <div className="flex gap-4">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="status"
                                  value="active"
                                  checked={isActive === "active"}
                                  onChange={(e) => setIsActive(e.target.value)}
                                  className="form-radio text-blue-600 mx-2"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                  Active
                                </span>
                              </label>

                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="status"
                                  value="inactive"
                                  checked={isActive === "inactive"}
                                  onChange={(e) => setIsActive(e.target.value)}
                                  className="form-radio text-blue-600 mx-2"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                  Inactive
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                        {/* Description */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                          <div>
                            <label
                              htmlFor="categoryName"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Description{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              id="description"
                              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            />
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className="mt-4 cursor-pointer hover:opacity-75"
                        >
                          Add Category
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddCategory;
