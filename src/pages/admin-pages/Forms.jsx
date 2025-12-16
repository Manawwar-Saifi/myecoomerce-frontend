import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import AdminTable from "../../components/admin-components/components/Table";
import proudimg from "../../assets/2149635272.webp";
import { useState } from "react";

const Forms = () => {
  const [formData, setFormData] = useState([
    {
      id: 1,
      image: "",
      name: "iPhone 15",
      category: "Electronics",
      price: 999,
      description: "Description",
      quantity: 5,
      status: "visible",
    },
    {
      id: 2,
      image: "",
      name: "MacBook Pro",
      category: "Computers",
      price: 1999,
      description: "Description",
      quantity: 5,
      status: "hidden",
    },
    {
      id: 3,
      image: "",
      name: "Samsung S22",
      category: "Electronics",
      price: 899,
      description: "Description",
      quantity: 5,
      status: "hidden",
    },
    {
      id: 4,
      image: "",
      name: "HP Spectre",
      category: "Computers",
      price: 1500,
      description: "Description",
      quantity: 5,
      status: "visible",
    },
    {
      id: 5,
      image: "",
      name: "Sony WH1000XM5",
      category: "Audio",
      price: 350,
      description: "Description",
      quantity: 5,
      status: "visible",
    },
    {
      id: 6,
      image: "",
      name: "Logitech MX Master 3",
      category: "Accessories",
      price: 100,
      description: "Description",
      quantity: 5,
      status: "hidden",
    },
    {
      id: 7,
      image: "",
      name: "Nike Air Max",
      category: "Clothing",
      price: 120,
      description: "Description",
      quantity: 5,
      status: "hidden",
    },
    {
      id: 8,
      image: "",
      name: "Adidas Ultraboost",
      category: "Clothing",
      price: 140,
      description: "Description",
      quantity: 5,
      status: "hidden",
    },
  ]);

  const handleToggle = (id) => {
    const updatedForms = formData.map((form) =>
      form.id === id
        ? {
            ...form,
            status: form.status === "visible" ? "hidden" : "visible",
          }
        : form
    );
    setFormData(updatedForms);
  };

  const handleDelete = (id) => {
    const updatedForms = formData.filter((form) => form.id !== id);
    setFormData(updatedForms);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.row.image ? params.row.image : proudimg}
          alt={params.row.name}
          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    { field: "name", headerName: "Form Name", width: 150 },
    { field: "category", headerName: "Category", width: 200 },
    { field: "price", headerName: "Price", type: "number", width: 100 },
    {
      field: "description",
      headerName: "Description",
      type: "string",
      width: 130,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      width: 100,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Link to={`/admin/form/details/${params.row.id}`}>
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
  ];

  return (
    <div className="adminMainProductPage">
      <section className="section1 shadow-md rounded-md py-2">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <h4>All Form Queries</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="section2 mt-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 p-0">
              <AdminTable rows={formData} columns={columns} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Forms;
