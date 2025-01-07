import SideBar from "../component/SideBar";

import { useContext } from "react";
import { Outlet } from "react-router-dom";
import SearchBar from "../component/SearchBar";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../utils/session";

const Layout = () => {
  const { user, setPlayer } = useContext(AuthContext);

  const onQueryChange = async (query) => {
    if (!query.country.trim() && !query.searchKey.trim()) return; // Don't fetch if query is empty

    console.log(query); // Log the query object for debugging
    try {
      const response = await axiosInstance.get("/user/players/all", {
        params: {
          ...(query.country.trim() && { country: query.country }),
          page: 1,
          pageSize: 1000,
          ...(query.searchKey.trim() && { searchKey: query.searchKey }),
        },
      });

      setPlayer(response.data.data); // Set the filtered players
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden ">
      <div className="w-[15%] bg-white shadow-md">
        <SideBar role={user?.role} />
      </div>
      <div className="flex-1 p-4">
        <SearchBar
          // placeholder="Search players by country..."
          onQueryChange={onQueryChange}
        />

        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
