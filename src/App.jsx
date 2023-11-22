import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Product from "./pages/Product.jsx";
import Homepage from "./pages/Homepage.jsx";
import Pricing from "./pages/Pricing.jsx";
import NotFound from "./pages/NotFound.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Homepage />,
    },
    {
        path: "product",
        element: <Product />,
    },
    {
        path: "pricing",
        element: <Pricing />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}
