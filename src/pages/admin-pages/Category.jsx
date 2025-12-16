import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import AdminTable from "../../components/admin-components/components/Table";
import proudimg from "../../assets/2149635272.webp";
import { useState } from "react";
import placeholder from "../../../public/300x200.svg";
import placeholder2 from "../../../public/placeholder.webp";
import Loader from "../../utils/Loader.jsx";
import { useEffect } from "react";
import { useAllCategoryAdmin } from "../../api/adminCategoryApiCalls/categories.js";
import { showError, showSuccess } from "../../utils/Toasty.jsx";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const queryClient = useQueryClient();

  const {
    data: categoryData,
    isLoading,
    isError,
  } = useAllCategoryAdmin({
    key: "all-categories",
    endpoint: "category/all",
    select: (data) =>
      data.map((cat) => ({
        ...cat,
        id: cat._id,
        status: cat.isActive ? "visible" : "hidden",
      })),
  });

  // Keep local state in sync when data changes

  useEffect(() => {
    setCategories(categoryData);
  }, [categoryData]);

  const handleToggle = (id) => {
    const updated = categories.map((cat) =>
      cat.id === id
        ? {
            ...cat,
            status: cat.status === "visible" ? "hidden" : "visible",
          }
        : cat
    );
    setCategories(updated);
  };

  // const handleDelete = (id) => {
  //   const updated = categories.filter((cat) => cat.id !== id);
  //   setCategories(updated);
  // };
  const handleDelete = async (id) => {
    try {
      console.log(id);
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

  // Loading and error UI after all hooks are declared
  if (isLoading) return <Loader />;

  if (isError)
    return (
      <div className="p-4 text-red-600">
        Failed to load products. Please try again.
      </div>
    );

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.row.image || placeholder2}
          alt={params.row.name}
          style={{
            width: 50,
            height: 50,
            objectFit: "cover",
            borderRadius: 4,
          }}
        />
      ),
    },
    { field: "name", headerName: "Name", width: 150 },
    { field: "description", headerName: "Description", width: 130 },
    {
      field: "seo",
      headerName: "SEO Details",
      width: 400,
      renderCell: (params) => {
        const seo = params.row.seo || {};
        const keywords = Array.isArray(seo.keyword) ? seo.keyword : [];
        return (
          <div className="text-sm">
            <strong>Title:</strong> {seo.title || "N/A"}
            <br />
            <strong>Desc:</strong> {seo.description || "N/A"}
            <br />
            <strong>Keywords:</strong>{" "}
            {keywords.length ? keywords.join(", ") : "N/A"}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Switch
          checked={params.row.status === "visible"}
          onChange={() => handleToggle(params.row.id)}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Link to={`/admin/category/update/${params.row.id}`}>
            <Button variant="outline" size="sm" className="text-xs px-2">
              <EditIcon fontSize="small" />
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            className="text-xs px-2"
            onClick={() => handleDelete(params.row.id)} // ✅ FIXED
          >
            <DeleteIcon fontSize="small" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="adminMainProductPage">
      <section className="section1 shadow-md rounded-md py-2">
        <div className="container-fluid">
          <div className="row">
            <div className="col-9">
              <h4>All Categories</h4>
            </div>
            <div className="col-3">
              <div className="innerDiv flex justify-end">
                <Link to="/admin/category/add">
                  <Button>Create New Category</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section2 mt-4 categorySectionDiv">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 p-0">
              <AdminTable rows={categories} columns={columns} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Category;
