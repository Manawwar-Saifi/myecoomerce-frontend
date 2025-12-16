import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import AdminTable from "../../components/admin-components/components/Table";
import placeholder from "../../../public/placeholder.webp";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../utils/Loader.jsx";
import { useMemo } from "react";
import axios from "@/lib/axiosInstance";
import { showError, showSuccess } from "@/utils/Toasty";

const Products = () => {
  const {
    data: productData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8000/api/product/all");
      const data = await res.json();
      console.log("data",data);
      console.log(data.data.data);
      return data.data.data;
    },
    select: (data) =>
      data.map((product) => ({
        ...product,
        id: product._id, // Required by MUI DataGrid
        category: product.categories?.map((c) => c.name).join(", "), // Fix category field
        status: product.isActive ? "visible" : "hidden", // Add status for switch
        price: product.sellPrice || product.regularPrice || 0, // Choose one
      })),

    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnMount: "always",
  });

  const handleToggle = (id) => {
    console.log("Toggle visibility for:", id);
    // Add PATCH request here if needed
  };

  const queryClient = useQueryClient();

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/product/delete/${id}`
      );
      if (res.status === 200) {
        showSuccess("Product deleted successfully.");
        // Invalidate the all-products query to refetch the updated list
        queryClient.invalidateQueries({ queryKey: ["all-products"] });
      } else {
        showError(res.data?.message || "Failed to delete product.");
      }
    } catch (error) {
      showError(
        error?.response?.data?.message ||
          error.message ||
          "An error occurred while deleting the product."
      );
    }
  };

  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 50 },
      {
        field: "image",
        headerName: "Image",
        width: 100,
        renderCell: (params) => (
          <img
            loading="lazy"
            src={params.row.image || placeholder}
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
      { field: "name", headerName: "Product Name", width: 150 },
      { field: "category", headerName: "Category", width: 200 },
      { field: "price", headerName: "Price", type: "number", width: 100 },
      { field: "description", headerName: "Description", width: 130 },
      { field: "quantity", headerName: "Quantity", type: "number", width: 100 },
      { field: "status", headerName: "Status", width: 100 },
      {
        field: "actions",
        headerName: "Actions",
        width: 140,
        sortable: false,
        renderCell: (params) => (
          <div className="flex gap-2">
            <Link to={`/admin/products/update/${params.row.id}`}>
              <Button variant="outline" size="sm" className="text-xs px-2">
                <EditIcon fontSize="small" />
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              className="text-xs px-2"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          </div>
        ),
      },
      {
        field: "isActive",
        headerName: "Visibility",
        width: 120,
        renderCell: (params) => (
          <Switch
            checked={params.row.status === "visible"}
            onChange={() => handleToggle(params.row.id)}
            color="primary"
          />
        ),
      },
    ],
    []
  );

  // Loading and error UI after all hooks have run
  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="p-4 text-red-600">
        Failed to load products. Please try again.
      </div>
    );

  return (
    <div className="adminMainProductPage">
      <section className="section1 shadow-md rounded-md py-2 px-4 bg-white">
        <div className="flex justify-between items-center">
          <h4 className="text-xl font-semibold">All Products</h4>
          <Link to="/admin/product/add">
            <Button>Add New Product</Button>
          </Link>
        </div>
      </section>

      <section className="section2 mt-4">
        <AdminTable rows={productData} columns={columns} />
      </section>
    </div>
  );
};

export default Products;
