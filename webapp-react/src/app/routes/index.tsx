import { type RouteObject } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import ChatbotPage from "../pages/ChatbotPage";
import EventsPage from "../pages/EventsPage";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: "/profile", element: <ProfilePage /> }],
      },
      {
        element: <ProtectedRoute />,
        children: [{ path: "/chatbot", element: <ChatbotPage /> }],
      },
      {
        element: <ProtectedRoute />,
        children: [{ path: "/events", element: <EventsPage /> }],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
