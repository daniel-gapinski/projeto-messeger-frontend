import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Private from "./Private";
import ChatLayout from "../pages/ChatLayout";
import ChatWindow from "../pages/ChatWindow";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <Private>
        <ChatLayout />
      </Private>
    ),
    children: [
      {
        path: ":conversationId",
        element: <ChatWindow />,
      },
    ],
  },
]);

export default router;
