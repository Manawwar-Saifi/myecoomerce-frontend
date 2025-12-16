import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "../../components/ui/button";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useEffect } from "react";
import placeholder from "../../../public/300x200.svg";
import { useSingleCategoryAdmin } from "../../api/adminCategoryApiCalls/categories.js";
import Loader from "../../utils/Loader.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { showSuccess, showError } from "../../utils/Toasty.jsx";

const UpdateCategory = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [name, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const { data: category, isLoading, isError } = useSingleCategoryAdmin({ id });

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setDescription(category.description);
      setIsActive(category.isActive ? "active" : "inactive");
      setImage(category.image);
    }
  }, [category]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
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
      const res = await fetch(
        `http://localhost:8000/api/category/update/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Update failed.");

      showSuccess("Category updated successfully.");

      navigate("/admin/categories");
      queryClient.invalidateQueries({ queryKey: ["single-category", id] });
      queryClient.invalidateQueries({ queryKey: ["all-categories"] });
    } catch (err) {
      showError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/category/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Delete Category failed.");

      showSuccess("Category Deleted successfully.");

      navigate("/admin/categories");
      queryClient.invalidateQueries({ queryKey: ["delete-category", id] });
      queryClient.invalidateQueries({ queryKey: ["all-categories"] });
    } catch (err) {
      showError(err.message);
    }
  };








  

  if (isLoading) return <Loader />;
  if (isError) return <div>Error fetching category</div>;

  return (
    <div className="update-category-page-div">
      <div className="updateProductPageMainDiv">
        <section className="section1 shadow-md rounded-md py-2 mb-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-9">
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
              <div className="col-3">
                <div className="innerDiv flex align-middle justify-around">
                  <span
                    className="rounded-md border-2 border-red-700 py-2 w-10 flex align-middle justify-center  cursor-pointer hover:opacity-75 hover:bg-red-200"
                    onClick={() => handleDelete(category._id)}
                  >
                    <DeleteIcon
                      fontSize="small"
                      className="text-red-700 h-100 mx-auto"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section2">
          <div className="container-fluid shadow-md rounded-md py-2">
            <div className="row ">
              <div className="col-lg-7 col-sm-12 rightDiv">
                <div className="innerDiv">
                  <div className="bg-gray-100flex items-center justify-center font-inter">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl md:p-8">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-2xl font-bold text-gray-800">
                          Update Category
                        </h4>
                      </div>

                      <form
                        onSubmit={handleUpdateSubmit}
                        className="space-y-6 addProductFrom"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              value={name}
                              onChange={(e) => setCategoryName(e.target.value)}
                            />
                          </div>

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
                                  className="form-radio text-blue-600"
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
                                  className="form-radio text-blue-600"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                  Inactive
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                          <div>
                            <label
                              htmlFor="description"
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
                          Update Category
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5 col-sm-12 leftDiv">
                <div className="row">
                  <div className="col-10 coverImage">
                    <div className="innerdiv">
                      <img
                        src={image || placeholder}
                        alt="coverImage"
                        className="w-100 rounded-2"
                      />
                      <button className="delete">
                        <CloseIcon />
                      </button>
                      <div className="fileChossene">
                        <label
                          htmlFor="file-upload"
                          className="custom-file-upload"
                        >
                          Change
                        </label>
                        <input
                          type="file"
                          id="file-upload"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
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

export default UpdateCategory;
