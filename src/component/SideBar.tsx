import { NavLink } from "react-router-dom";

interface SidebarProps {
  role: string;
}

type Role = "admin" | "staff" | "player";

const Sidebar = ({ role }: SidebarProps) => {
  // Define menu items for each role
  const menuItems = {
    admin: [
      { name: "Dashboard", path: "admin-dashboard" },
      { name: "User Management", path: "user-management" },
      { name: "Player Management", path: "player-management" },
      { name: "Leaderboard", path: "leaderboard" },
    ],
    staff: [
      { name: "Dashboard", path: "staff-dashboard" },
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
    <div className="w-full h-screen bg-gray-800 text-white shadow-lg border-2 flex flex-col">
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
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Logout Button at the Bottom */}
      <div className="mt-auto">
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
  );
};

export default Sidebar;
