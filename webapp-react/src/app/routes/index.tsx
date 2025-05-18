import { type RouteObject } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import ProtectedRoute from "./ProtectedRoute";

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: "/profile", element: <Profile /> }],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];
