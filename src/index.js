import './main.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import AddAirport, { addAirportLoader } from "./pages/AddAirport/AddAirport";
import AddFlight, { addFlightLoader } from './pages/AddFlight/AddFlight';
import NewHotel, { addHotelLoader, newHotelAction } from './pages/Hotels/New';
import Hotel, { hotelLoader, hotelAction } from './pages/Hotels/Hotel';
import Trips from './pages/AddTrip/Trips';
import Layout from './pages/Layout';
import Hotels from './pages/Hotels/Hotels';

const router = createHashRouter(
	createRoutesFromElements(
		<Route element={<Layout/>}>
			<Route index path="/" element={<Home/>}/>
			<Route path="/airports/new" element={<AddAirport/>} loader={addAirportLoader}/>
			<Route path="/flights/new" element={<AddFlight/>} loader={addFlightLoader}/>
			<Route path="/hotels" element={<Hotels/>}/>
			<Route path="/hotels/:hotelID" element={<Hotel/>} loader={hotelLoader} action={hotelAction}/>
			<Route path="/hotels/new" element={<NewHotel/>} loader={addHotelLoader} action={newHotelAction}/>
			<Route path="/bookTrip" element={<Trips/>}/>
		</Route>
	)
)

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		{/* <RouterProvider router={router}/> */}
		<h1>This is a test</h1>
	</React.StrictMode>
);
