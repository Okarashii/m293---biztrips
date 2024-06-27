import './main.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route, Outlet, createRoutesFromElements } from "react-router-dom";
import Home from "./pages/Home";
import Airport from "./pages/Airports";
import Flights from './pages/Flights';

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home/>
	},
	{
		path: "/airports",
		element: <Airport/>
	},
	{
		path: "/flights",
		element: <Flights/>
	}
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router}/>
	</React.StrictMode>
);

// ReactDOM.render(<App />, document.getElementById("root"));
