import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "../../components/ui/button";
import { Link, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../utils/Loader.jsx";
import placeholder from "../../../public/300x200.svg";
import placeholder2 from "../../../public/placeholder.webp";
import { useAllCategoryAdmin } from "../../api/adminCategoryApiCalls/categories.js";
import { useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "../../utils/Toasty.jsx";
import { useNavigate } from "react-router-dom";
import DeleteSingleProductAditionalImage from "../../utils/DeleteSingleProductAditionalImage.jsx";
const UpdateProduct = () => {
  const { id } = useParams();
  const [checked, setChecked] = useState(true);

  const [name, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [regularPrice, setRegularPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [categories, setCategories] = useState([]);
  const [isActive, setIsActive] = useState(false);

  // const [additionalImages, setAdditionalImages] = useState([]);
  const [coverImage, setCoverImage] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["single-product", id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/api/product/single/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const result = await res.json();
      return result.data.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (product) {
      setProductName(product.name || "");
      setDescription(product.description || "");
      setRegularPrice(product.regularPrice || 0);
      setSellPrice(product.sellPrice || 0);
      setQuantity(product.quantity || 1);
      setIsActive(product.isActive || false);
      setCoverImage(product.image || "");
      setCategories(product.categories || []);
      setAdditionalImages(product.additionalImages || []);
    }
  }, [product]);

  const handleSwitchChange = (event) => {
    setChecked(event.target.checked);
  };

  const { data: categoryData } = useAllCategoryAdmin({
    key: "all-categories",
    endpoint: "category/all",
    select: (data) =>
      data.map((cat) => ({
        ...cat,
        id: cat._id,
        status: cat.isActive ? "visible" : "hidden",
      })),
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleProductUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("regularPrice", regularPrice);
    formData.append("sellPrice", sellPrice);
    formData.append("quantity", quantity);
    formData.append("isActive", checked);

    // 1️⃣ Main image
    if (coverImage && typeof coverImage !== "string") {
      formData.append("image", coverImage);
    }

    // 2️⃣ Categories array
    // send every category ID under the key "categories[]"
    categories.forEach((cat) => {
      formData.append("categories[]", cat._id);
    });

    // 3️⃣ Additional images
    additionalImages.forEach((file) => {
      formData.append("additionalImages", file);
    });

    try {
      const res = await fetch(
        `http://localhost:8000/api/product/update/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Update failed.");
      showSuccess("✅ Product updated successfully!");
      navigate("/admin/products");
      queryClient.invalidateQueries({ queryKey: ["addproduct"] });
      queryClient.invalidateQueries({ queryKey: ["all-categories"] });
      queryClient.invalidateQueries({ queryKey: ["single-product"] });
      queryClient.invalidateQueries({ queryKey: ["all-products"] });

      await queryClient.invalidateQueries({
        queryKey: ["all-products"],
        refetchInactive: true,
      });
      // refetchInactive: true
    } catch (err) {
      showError("❌ " + err.message);
    }
  };

  const deleteSingleProductAditionalImage = async (imageId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/product/delete-single-additional-image/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageId: imageId,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        showSuccess(data.message);
      } else {
        showError(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) return <Loader />;
  if (isError)
    return <div className="text-red-500">Failed to load product</div>;

  return (
    <div className="updateProductPageMainDiv">
      <section className="section1 shadow-md rounded-md py-2 mb-3">
        <div className="container-fluid">
          <div className="row">
            <div className="col-9">
              <Link to="/admin/products">
                <Button
                  variant="outline"
                  className="mx-2 cursor-pointer hover:opacity-75"
                >
                  <ArrowBackIcon fontSize="small" />
                </Button>
                Add New Product
              </Link>
            </div>
            <div className="col-3">
              <div className="innerDiv flex align-middle justify-around">
                <span className="rounded-md border-2 border-red-700 py-2 w-10 flex align-middle justify-center cursor-pointer hover:opacity-75 hover:bg-red-200">
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
          <div className="row">
            <div className="col-lg-7 col-sm-12 rightDiv">
              <div className="innerDiv">
                <div className="bg-gray-100 flex items-center justify-center font-inter">
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl md:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-2xl font-bold text-gray-800">
                        Update Product
                      </h4>
                    </div>
                    <form
                      className="space-y-6 addProductFrom"
                      onSubmit={handleProductUpdate}
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setProductName(e.target.value)}
                          className="form-control"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="form-control"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Regular Price ₹
                          </label>
                          <input
                            type="number"
                            value={regularPrice}
                            onChange={(e) => setRegularPrice(e.target.value)}
                            className="form-control"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sell Price ₹
                          </label>
                          <input
                            type="number"
                            value={sellPrice}
                            onChange={(e) => setSellPrice(e.target.value)}
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="form-control"
                        />
                      </div>

                      <Button type="submit" className="mt-4">
                        Update Product
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5 col-sm-12 leftDiv">
              <div className="row">
                <div className="col-4 coverImage">
                  <div className="innerdiv">
                    <img
                      src={coverImage || placeholder}
                      alt="coverImage"
                      className="w-100"
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
                        name="image" // optional, but matches server field
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCoverImage(file);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="innerDiv2 mb-3">
                    <p>
                      <strong>Product Visibility</strong>
                    </p>
                    <Switch checked={checked} onChange={handleSwitchChange} />
                  </div>
                </div>

                <div className="col-8 flex flex-wrap otherImage">
                  {additionalImages.map((img, idx) => (
                    <div key={idx}>
                      <img src={img.url || placeholder2} alt="OtherImage" />
                      <button
                        value={img._id}
                        onClick={() =>
                          deleteSingleProductAditionalImage(img._id)
                        }
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  ))}

                  {/* Additional Images Picker */}
                  <div className="flex items-center space-x-2">
                    <label
                      htmlFor="additional-images-upload"
                      className="cursor-pointer p-2 rounded border hover:bg-gray-100"
                    >
                      <AddIcon /> Add
                    </label>
                    <input
                      id="additional-images-upload"
                      type="file"
                      name="additionalImages"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setAdditionalImages(files);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row pb-5 pt-2 categoriesDivRow">
            {/* <h4 className="pb-3">Categories</h4> */}
            {/* <div className="col-12">
              {categories.length > 0 ? (
                categories.map((cat, idx) => (
                  <div className="flex items-center" key={idx}>
                    <input
                      type="checkbox"
                      checked={true}
                      className="w-4 h-4"
                      readOnly
                    />
                    <label className="ms-2 text-sm font-medium text-gray-900">
                      {cat.name}
                    </label>
                  </div>
                ))
              ) : (
                <h4 className="text-center w-100">Category is not assigned</h4>
              )}
            </div> */}
            <div className="col-12">
              <div className="mt-0">
                <h4>All categories available</h4>
                {categoryData &&
                  categoryData.map((cate, index) => {
                    const isChecked = categories.some(
                      (c) => c._id === cate._id
                    ); // match by _id
                    return (
                      <div key={cate._id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="allCategory"
                          value={cate._id}
                          checked={isChecked}
                          className="w-4 h-4"
                          onChange={() => {
                            if (isChecked) {
                              setCategories(
                                categories.filter((c) => c._id !== cate._id)
                              );
                            } else {
                              setCategories([...categories, cate]);
                            }
                          }}
                        />
                        <label className="text-sm text-gray-800">
                          {cate.name}
                        </label>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpdateProduct;
