import { ChevronDown, ChevronUp, Edit, Eye, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import AuthGuard from "../../guard/AuthGuard";
import axiosInstance from "../../utils/session";
import { Meta } from "../user/UserTable";
import PlayerForm from "./PlayerForm";
import StatsModal from "./Stats";

// Type definitions remain the same
type Statistics = {
  id: string;
  coins: number;
  experience_point: number;
  games_played: number;
  games_won: number;
};

type User = {
  id: string;
  name: string;
  country: string;
  password: string;
  active: boolean;
  stats_id: string;
  statistics: Statistics;
};

const PlayerTable: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [selectedStats, setSelectedStats] = useState<{
    coins: number;
    experience_point: number;
    games_played: number;
    games_won: number;
  } | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [createNew, setCreateNew] = useState(false); // Editing state
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState<keyof User | keyof Statistics>(
    "id"
  );

  const [isActive, setIsActive] = useState<boolean>(false); // [isActive, setActive]

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  // Sorting logic
  const sortedData = [...data].sort((a, b) => {
    let aValue =
      sortColumn in a
        ? a[sortColumn as keyof User]
        : a.statistics[sortColumn as keyof Statistics];
    let bValue =
      sortColumn in b
        ? b[sortColumn as keyof User]
        : b.statistics[sortColumn as keyof Statistics];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const handleSort = (column: keyof User | keyof Statistics) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleDelete = (id: string) => {
    // Implement delete logic here
  };

  const handleEdit = (user: User) => {
    setIsEditing(true);
    setEditUser(user);
  };

  const saveEdit = () => {
    if (editUser) {
      const updatedData = data.map((user) =>
        user.id === editUser.id ? editUser : user
      );
      setData(updatedData);
      setIsEditing(false);
      setEditUser(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editUser) {
      setEditUser({ ...editUser, [e.target.name]: e.target.value });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  //view func
  const handleViewStats = (stats: Statistics) => {
    setSelectedStats({
      coins: stats.coins, // Use actual coins data if available in `stats`
      experience_point: stats.experience_point,
      games_played: stats.games_played,
      games_won: stats.games_won,
    });
    setIsStatsModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/user/players/all", {
          params: { page: currentPage, pageSize: rowsPerPage },
        });
        setData(response.data.data);
        setMeta(response.data.meta);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [currentPage, rowsPerPage, isActive]);

  const toggleSwitch = async (userId: string, currentState: boolean) => {
    try {
      // Call the API to toggle the state
      const response = await axiosInstance.patch(
        `/user/player/setInactive/${userId}`
      );

      // Check the message in the response and update the user's active state
      const isActive = response.data.message === "player set to Active";

      setData((prevData) =>
        prevData.map((user) =>
          user.id === userId
            ? { ...user, active: isActive } // Update state based on response message
            : user
        )
      );
    } catch (error) {
      console.error("Failed to toggle active state:", error);
      alert("Error toggling the user's active state.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Player Management
        </h1>
        {/* <button
          className=" border-2 p-2 bg-black text-white  w-fit ml-0"
          onClick={() => setCreateNew(true)}
        >
          Create New Player
        </button> */}
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <tr>
                  {[
                    "ID",
                    "Name",
                    "Country",
                    "Password",
                    "Active",
                    "View Stats",
                    "Actions",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer"
                      onClick={() =>
                        handleSort(
                          header.toLowerCase() as keyof User | keyof Statistics
                        )
                      }
                    >
                      <div className="flex items-center">
                        {header}
                        {sortColumn === header.toLowerCase() &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ••••••••
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center justify-center">
                        {
                          // loading === user.id ? (
                          //   <span className="text-gray-500">Loading...</span>
                          // ) : (
                          <button
                            onClick={() => toggleSwitch(user.id, user?.active)}
                            className={`relative inline-flex h-6 w-12 rounded-full transition-colors focus:outline-none ${
                              user.active ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 rounded-full bg-white transform transition-transform ${
                                user.active ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                          // )
                        }
                      </div>
                      {/* <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.active ? "Active" : "Inactive"}
                      </span> */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleViewStats(user.statistics)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 flex items-center justify-center gap-2"
                      >
                        <Eye className="h-5 w-5" /> <span>view</span>
                      </button>
                    </td>
                    {/*
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.statistics.games_played}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.statistics.games_won}
                    </td> */}
                    <AuthGuard>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </AuthGuard>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === meta?.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * rowsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * rowsPerPage, meta?.totalItems || 0)}
                  </span>{" "}
                  of <span className="font-medium">{meta?.totalItems}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronDown className="h-5 w-5 transform rotate-90" />
                  </button>
                  {/* Add page numbers here if needed */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === meta?.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronDown className="h-5 w-5 transform -rotate-90" />
                  </button>
                </nav>
              </div>
            </div>
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
            <PlayerForm
              user={editUser}
              close={() => {
                setEditUser(null);

                setCreateNew(false);
              }}
              setData={setData}
            />
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
            <PlayerForm
              // user={editUser}
              close={() => setCreateNew(false)}
              setData={setData}
            />
          </div>
        </div>
      )}

      <StatsModal
        isOpen={isStatsModalOpen}
        stats={selectedStats}
        onClose={() => setIsStatsModalOpen(false)}
      />
    </div>
  );
};

export default PlayerTable;
