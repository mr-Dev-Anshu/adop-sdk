import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Product from "./pages/Product.jsx";
import About from "./pages/About.jsx";
import Cart from "./pages/Cart.jsx";
import RastaDikhao from "../../../src/index.js";

console.log("Before SDK:", window.location.href);
const sdk = RastaDikhao.init({
  apiKey: "dap_live_70c58ab91b6a257803cd96957ad94a547c12c981adfb4e06a70c58584d054911",
  host: "http://localhost:3000",
  debug: true,
});
//dap_live_e12696870d4d179ae6eafafc2934ef260e8aa403fe80e2aedf6e2166b579f652
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
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
