import './main.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Airports from "./pages/Airports";
import Flights from './pages/Flights';
import Hotels from './pages/Hotels';
import Rooms from './pages/Rooms';
import Trips from './pages/Trips';
import Meetings from './pages/Meetings';
import Participants from './pages/Participants';
import PlaneTickets from './pages/PlaneTickets';
import HotelBookings from './pages/HotelBookings';

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home/>
	},
	{
		path: "/airports",
		element: <Airports/>
	},
	{
		path: "/flights",
		element: <Flights/>
	},
	{
		path: "/hotels",
		element: <Hotels/>
	},
	{
		path: "/hotels/:hotelID/rooms",
		element: <Rooms/>
	},
	{
		path: "/trips",
		element: <Trips/>
	},
	{
		path: "/trips/:tripID/meetings",
		element: <Meetings/>
	},
	{
		path: "/trips/:tripID/participants",
		element: <Participants/>
	},
	{
		path: "/trips/:tripID/participants/:participantID/planetickets",
		element: <PlaneTickets/>
	},
	{
		path: "/trips/:tripID/participants/:participantID/hotelbooking",
		element: <HotelBookings/>
	}
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router}/>
	</React.StrictMode>
);
