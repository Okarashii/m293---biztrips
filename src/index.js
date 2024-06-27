import './main.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route, Outlet, createRoutesFromElements } from "react-router-dom";
import Home from "./pages/Home";
import Airport from "./pages/Airport";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home/>
	},
	{
		path: "/airport",
		element: <Airport/>
	}
]);



ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router}/>
	</React.StrictMode>
);

// ReactDOM.render(<App />, document.getElementById("root"));
