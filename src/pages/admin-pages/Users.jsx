import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import AdminTable from "../../components/admin-components/components/Table";
import proudimg from "../../assets/2149635272.webp";
import { useEffect, useState } from "react";
// If using a toast library like react-hot-toast
// import { toast } from "react-hot-toast";

import placeholder from "../../../public/300x200.svg"


const Users = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch users (simple version)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/user/all");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        console.log(data.data.users)
        // adjust based on your backend response
        setUserData(
          (data.users || data.data?.users || []).map((user) => ({
            ...user,
            id: user._id, // map _id → id
          }))
        );
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Delete user (frontend only here)
  const handleDelete = (id) => {
    setUserData((prev) =>
      prev.filter((user) => user.id !== id && user._id !== id)
    );
  };

  const handleToggle = (id) => {
    setUserData((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "visible" ? "hidden" : "visible",
            }
          : user
      )
    );
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.row.image || placeholder}
          alt={params.row.name}
          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 180 },
    { field: "role", headerName: "Role", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Link to={`/admin/user/${params.row.id}`}>
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
  ];

  return (
    <div className="adminMainProductPage">
      <section className="section1 shadow-md rounded-md py-2">
        <div className="container-fluid">
          <div className="row">
            <div className="col-9">
              <h4>All Users</h4>
            </div>
            <div className="col-3 flex justify-end"></div>
          </div>
        </div>
      </section>

      <section className="section2 mt-4">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 p-0">
              <AdminTable rows={userData} columns={columns} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Users;
