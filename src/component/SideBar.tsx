import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  role: string;
}

type Role = "admin" | "staff" | "player";

const Sidebar = ({ role }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Define menu items for each role
  const menuItems = {
    admin: [
      { name: "Dashboard", path: "admin-dashboard" },
      { name: "User Management", path: "user-management" },
      { name: "Player Management", path: "player-management" },
      { name: "Leaderboard", path: "leaderboard" },
    ],
    staff: [
      { name: "Dashboard", path: "dashboard" },
      { name: "Player Management", path: "player-management" },
    ],
    player: [
      { name: "Dashboard", path: "/player-dashboard" },
      { name: "Leaderboard", path: "/leaderboard" },
    ],
  };

  // Get the menu for the current role
  const items = menuItems[role as Role] || [];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-20 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-gray-800 text-white shadow-lg h-screen 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}
      >
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-bold text-center py-4 border-b border-gray-700 capitalize">
            {role} Panel
          </h2>

          <ul className="mt-4 space-y-2 flex-1">
            {items.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }: { isActive: boolean }) =>
                    `block px-4 py-2 hover:bg-gray-700 rounded ${
                      isActive ? "bg-gray-700" : ""
                    }`
                  }
                  onClick={() => setIsOpen(false)} // Close sidebar on mobile when a link is clicked
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Logout Button at the Bottom */}
          <div className="mt-auto p-4">
            <button
              className="w-full py-2 bg-red-600 hover:bg-red-700 rounded text-white"
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/";
                alert("Logged out successfully");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
