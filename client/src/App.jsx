import React from "react";
import Signup from "./pages/Signup.jsx";
import SentRequests from "./components/SentRequests.jsx";
import Signin from "./pages/Signin.jsx";
import PendingRequests from "./components/PendingRequests.jsx";
import PersonalProfile from "./pages/PersonalProfile.jsx";
import Profile from "./pages/Profile.jsx";
import Home from "./pages/Home.jsx";
import AddFriend from "./components/AddFriend.jsx";
import MyFriends from "./components/MyFriends.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Messages from "./pages/Messages.jsx";
import Auth from "./pages/Auth.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
    errorElement: <div>404</div>,
  },
  {
    path: "/Signup",
    element: <Signup />,
    errorElement: <div>404</div>,
  },
  {
    path: "/Signin",
    element: <Signin />,
    errorElement: <div>404</div>,
  },
  {
    path: "/AddFriend",
    element: <AddFriend />,
    errorElement: <div>404</div>,
  },
  {
    path: "/Home",
    element: <Home />,
    errorElement: <div>404</div>,
  },
  {
    path: "/MyFriends",
    element: <MyFriends />,
    errorElement: <div>404</div>,
  },
  {
    path: "/PendingRequests",
    element: <PendingRequests />,
    errorElement: <div>404</div>,
  },
  {
    path: "/Profile",
    element: <Profile />,
    errorElement: <div>404</div>,
  },
  {
    path: "/PersonalProfile",
    element: <PersonalProfile />,
    errorElement: <div>404</div>,
  },
  {
    path: "/SentRequests",
    element: <SentRequests />,
    errorElement: <div>404</div>,
  },
  {
    path: "Messages",
    element: <Messages />,
    errorElement: <div>404</div>,
  },
]);

const App = () => (
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

export default App;
