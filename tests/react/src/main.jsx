import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Product from "./pages/Product.jsx";
import About from "./pages/About.jsx";
import RastaDikhao from "../../../src/index.js";

console.log("Before SDK:", window.location.href);
const sdk = RastaDikhao.init({
  apiKey: "tenant123",
  debug: true,
});

console.log("After SDK:", window.location.href);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product",
        element: <Product />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
