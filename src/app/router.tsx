import { createBrowserRouter } from "react-router-dom";

import { LoginPage } from "../pages/LoginPage.tsx";
import { HomePage } from "../pages/HomePage.tsx";

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/home", element: <HomePage /> },
]);
