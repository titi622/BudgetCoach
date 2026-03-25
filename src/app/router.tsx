import { createBrowserRouter } from "react-router-dom";

import { LoginPage } from "../pages/LoginPage.tsx";
import HomePage from "../pages/HomePage.tsx";
import { AssetInputPage } from "../pages/AssetInputPage.tsx";
import QueryTest from "../pages/QueryTest.tsx";

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/add/:category", element: <AssetInputPage /> },
  { path: "/api/test", element: <QueryTest /> },
]);
