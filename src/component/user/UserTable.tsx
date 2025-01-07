import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/session";
import CreateUser from "./form/CreateUser";

// Type definitions for User
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};
export interface Meta {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const UserTable: React.FC = () => {
  const [data, setData] = useState<User[]>([]); // Store fetched data
  const [meta, setMeta] = useState<Meta | null>(null);

  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [rowsPerPage] = useState(10); // Rows per page
  const [sortColumn, setSortColumn] = useState<keyof User>("id"); // Sorting column
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // Sorting direction
  const [isEditing, setIsEditing] = useState(false); // Editing state
  const [createNew, setCreateNew] = useState(false); // Editing state

  const [editUser, setEditUser] = useState<User | null>(null); // User being edited

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = data?.slice(indexOfFirstRow, indexOfLastRow) || [];

  // Sorting logic
  const sortedData = [...currentData].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  // Handle column sorting
  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Handle delete action
  const handleDelete = async (id: string) => {
    try {
      const updatedData = data?.filter((user) => user.id !== id);
      await axiosInstance.delete(`/user/${id}`);
      setData(updatedData);
      window.alert("User deleted successfully");
    } catch (error: any) {
      window.alert(error.message);
    }
  };

  // Handle edit action
  const handleEdit = (user: User) => {
    setIsEditing(true);
    setEditUser(user);
  };

  // Save edited user
  const saveEdit = () => {
    if (editUser) {
      const updatedData = data?.map((user) =>
        user.id === editUser.id ? editUser : user
      );
      setData(updatedData);
      setIsEditing(false);
      setEditUser(null);
    }
  };

  // Handle input changes in the edit modal
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editUser) {
      setEditUser({ ...editUser, [e.target.name]: e.target.value });
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate total pages
  const totalPages = Math.ceil((data?.length || 0) / rowsPerPage);

  // Fetch data (mock data for now)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/user", {
          params: { page: currentPage, pageSize: rowsPerPage },
        });
        setData(response.data.data);
        setMeta(response.data.meta);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [currentPage, rowsPerPage]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          User Table with Full Features
        </h1>
        <button
          className=" border-2 p-2 bg-black text-white  w-fit ml-0"
          onClick={() => setCreateNew(true)}
        >
          Create New User
        </button>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th
                  className="px-6 py-3 border border-gray-200 cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  ID{" "}
                  {sortColumn === "id" && (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-6 py-3 border border-gray-200 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name{" "}
                  {sortColumn === "name" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-6 py-3 border border-gray-200 cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email{" "}
                  {sortColumn === "email" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="px-6 py-3 border border-gray-200 cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  Role{" "}
                  {sortColumn === "role" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th className="px-6 py-3 border border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((user) => (
                <tr className="bg-gray-50 text-gray-700" key={user.id}>
                  <td className="px-6 py-4 border border-gray-200 text-center">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 border border-gray-200 text-center">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 border border-gray-200 text-center">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 border border-gray-200 text-center">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 border border-gray-200 text-center">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-lg"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
            <button
              className="px-4 py-2 bg-teal-500 text-white rounded-lg disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {meta?.totalPages}
            </span>
            <button
              className="px-4 py-2 bg-teal-500 text-white rounded-lg disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === meta?.totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-700"
              onClick={() => {
                setEditUser(null);

                setIsEditing(false);
              }}
            >
              &times;
            </button>
            <CreateUser user={editUser} close={() => setIsEditing(false)} />
          </div>
        </div>
      )}

      {createNew && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-700"
              onClick={() => {
                setEditUser(null);
                setCreateNew(false);
              }}
            >
              &times;
            </button>
            <CreateUser
              user={editUser}
              close={() => setCreateNew(false)}
              setData={setData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
