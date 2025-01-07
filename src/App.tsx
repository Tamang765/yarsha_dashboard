import { Navigate, useRoutes } from "react-router-dom";
import AuthGuard from "./guard/AuthGuard";
import GuestGuard from "./guard/GuestGuard";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Leaderboard from "./component/player/LeaderBoard";
import PlayerTable from "./component/player/PlayerTable";
import UserTable from "./component/user/UserTable";
import Layout from "./layout/Layout";

export default function App() {
  return useRoutes([
    {
      path: "/",
      children: [
        { element: <Navigate to={"/login"} replace />, index: true },
        {
          path: "login",
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: "register",
          element: <Register />,
        },
      ],
    },

    {
      path: "/admin",
      element: (
        <AuthGuard>
          <Layout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={"/admin"} replace />, index: true },

        { path: "user-management", element: <UserTable /> },
        { path: "player-management", element: <PlayerTable /> },
        { path: "leaderboard", element: <Leaderboard /> },
      ],
    },
    {
      path: "/staff",
      element: (
        <GuestGuard>
          <Layout />
        </GuestGuard>
      ),
      children: [
        { element: <Navigate to={"/staff"} replace />, index: true },

        { path: "player-management", element: <PlayerTable /> },
      ],
    },
    {
      path: "/player",
      element: (
        <GuestGuard>
          <Layout />
        </GuestGuard>
      ),
      children: [
        { element: <Navigate to={"/player"} replace />, index: true },

        { path: "player-management", element: <PlayerTable /> },
      ],
    },
  ]);
}
