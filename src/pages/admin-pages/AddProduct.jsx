import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import dummyImage from "../../assets/2149635272.webp";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import Switch from "@mui/material/Switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "../../utils/Toasty.jsx";
import { useAllCategoryAdmin } from "../../api/adminCategoryApiCalls/categories.js";
import placdeholder from "../../../public/300x200.svg";

const AddProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [checked, setChecked] = useState(true);
  const handleSwitchChange = (event) => {
    setChecked(event.target.checked);
  };

  const [name, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [regularPrice, setRegularPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [categories, setCategories] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [coverImage, setCoverImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  // add this helper just below your imports:
  const toggleCategory = (id) => {
    setCategories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const { data: categoryData } = useAllCategoryAdmin({
    key: "all-categories",
    endpoint: "category/all",
    select: (data) =>
      data.map((cat) => ({
        ...cat,
        id: cat._id,
      })),
    // these go straight into useQuery’s config:
    staleTime: 0, // always consider it stale
    cacheTime: 0, // don't cache beyond immediate use
    refetchOnMount: "always", // refetch every time component mounts
  });

  console.log(categoryData);

  // === react-query mutation ===
  const addProductMutation = useMutation({
    mutationKey: ["addproduct"],
    mutationFn: async (formData) => {
      const res = await fetch("http://localhost:8000/api/product/add", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Create failed");
      return result.data;
    },
    onSuccess: () => {
      showSuccess("✅ Product added successfully!");
      queryClient.invalidateQueries(["all-products"]);
      queryClient.invalidateQueries({ queryKey: ["addproduct"] });
      queryClient.invalidateQueries({ queryKey: ["all-categories"] });
      queryClient.invalidateQueries({ queryKey: ["single-product"] });
      queryClient.invalidateQueries({ queryKey: ["all-products"] });

      navigate("/admin/products");
    },
    onError: (err) => {
      showError("❌ " + err.message);
    },
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("regularPrice", regularPrice);
    formData.append("sellPrice", sellPrice);
    formData.append("quantity", quantity);
    formData.append("isActive", checked);
    // ✅ right below your coverImage block, add:
    categories.forEach((catId) => {
      formData.append("categories", catId);
    });
    if (coverImage && typeof coverImage !== "string") {
      formData.append("image", coverImage);
    }

    // if (categories) {
    //   formData.append("categories", categories);
    // }

    additionalImages.forEach((file) => {
      formData.append("additionalImages", file);
    });

    addProductMutation.mutate(formData);
  };

  return (
    <div className="adminAddProductPage">
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
                <span className="rounded-md border-2 border-red-700 h-auto w-10 flex align-middle justify-center  cursor-pointer hover:opacity-75 hover:bg-red-200">
                  <DeleteIcon
                    fontSize="small"
                    className="text-red-700 h-100 mx-auto"
                  />
                </span>
                <Button variant="outline">Save Draft</Button>
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
                <div className="col-6 coverImage">
                  <div className="innerdiv">
                    <label
                      htmlFor="cover-upload"
                      className="change w-full h-full"
                      style={{
                        backgroundColor: "white",
                        border: "1px dashed gray",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        left: "0",
                        bottom: "0",
                        boxShadow: "0px 0px 20px -10px gray",
                        borderRadius: "10px",
                        zIndex: 1,
                      }}
                    >
                      cover image
                    </label>
                    <input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setCoverImage(e.target.files[0])}
                    />
                    <img
                      src={
                        coverImage
                          ? URL.createObjectURL(coverImage)
                          : placdeholder
                      }
                      alt="coverImage"
                      className={`w-100 ${coverImage ? "z-40" : "z-0"}`}
                    />
                  </div>
                  
                </div>
                <div className="col-6 flex flex-wrap otherImage">
                  {additionalImages.map((file, idx) => (
                    <div key={idx} className="relative m-1">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="OtherImage"
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setAdditionalImages((imgs) =>
                            imgs.filter((_, i) => i !== idx)
                          )
                        }
                        className="absolute top-0 right-0"
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  ))}
                  <label
                    htmlFor="additional-images-upload"
                    className="flex align-middle justify-center plusDiv cursor-pointer w-50 h-50"
                  >
                    <AddIcon />
                  </label>
                  <input
                    id="additional-images-upload"
                    type="file"
                    name="additionalImages"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      setAdditionalImages(Array.from(e.target.files))
                    }
                  />
                </div>
                    
                <div className="col-12">
                  <div className="mt-3">
                    <h4>All categories available</h4>
                    <div>
                      <p className="block text-sm font-medium text-gray-700 mb-1">
                        Categories <span className="text-red-500">*</span>
                      </p>
                      <div className="flex flex-col">
                        {categoryData.map((cat) => (
                          <label
                            key={cat.id}
                            className="inline-flex items-center"
                          >
                            <input
                              type="checkbox"
                              value={cat.id}
                              checked={categories.includes(cat.id)}
                              onChange={() => toggleCategory(cat.id)}
                              className="h-4 w-4"
                            />
                            <span className="ml-2 text-sm text-gray-800 mx-2">
                              {cat.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7 col-sm-12 rightDiv">
              <div className="innerDiv">
                <div className="bg-gray-100 flex items-center justify-center font-inter">
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl md:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-2xl font-bold text-gray-800">
                        Product Details
                      </h4>
                    </div>
                    <form
                      className="space-y-6 addProductFrom"
                      onSubmit={handleAddProduct}
                    >
                      <div>
                        <label
                          htmlFor="productName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="productName"
                          className="form-control"
                          placeholder="e.g. Natural Glow Face Moisturizer"
                          value={name}
                          onChange={(e) => setProductName(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="innerDiv2">
                            <p>
                              <strong>Visibilityfds</strong>
                            </p>
                            <Switch
                              checked={checked}
                              onChange={handleSwitchChange}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="quantity"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Quantity <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            id="quantity"
                            className="form-control"
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(Number(e.target.value))
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label
                            htmlFor="regularPrice"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Regular Price ₹
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            id="regularPrice"
                            className="form-control"
                            value={regularPrice}
                            onChange={(e) =>
                              setRegularPrice(Number(e.target.value))
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="sellPrice"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Sell Price ₹ <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            id="sellPrice"
                            className="form-control"
                            value={sellPrice}
                            onChange={(e) =>
                              setSellPrice(Number(e.target.value))
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="description"
                          className="form-control"
                          placeholder="Description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="mt-4 cursor-pointer hover:opacity-75"
                      >
                        Add Product
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
  );
};

export default AddProduct;
