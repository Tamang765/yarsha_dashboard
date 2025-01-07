import { useState } from "react";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("admins");

  return (
    <div>
      <h1>User Management</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab("admins")}>Admins</button>
        <button onClick={() => setActiveTab("staff")}>Staff</button>
        <button onClick={() => setActiveTab("players")}>Players</button>
      </div>
      <div className="tab-content">
        {activeTab === "admins" && <div>Admin Users</div>}
        {activeTab === "staff" && <div>Staff Users</div>}
        {activeTab === "players" && <div>Player Users</div>}
      </div>
    </div>
  );
};

export default UserManagement;
