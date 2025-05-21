import { type RouteObject } from "react-router-dom";
import Layout from "../components/Layout";
import ChatbotPage from "../pages/ChatbotPage";
import EventsPage from "../pages/EventsPage";
import HomePage from "../pages/HomePage";
import LeaveFeedback from "../pages/LeaveFeedback";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";

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
      {
        element: <ProtectedRoute />,
        children: [{ path: "/leave-feedback", element: <LeaveFeedback /> }],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
