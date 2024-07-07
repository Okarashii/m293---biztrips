import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import AddAirport from "./pages/AddAirport/AddAirport";
import AddFlight from './pages/AddFlight/AddFlight';
import NewHotel, { newHotelAction } from './pages/Hotels/New';
import Hotel, { hotelAction } from './pages/Hotels/Hotel';
import Trips from './pages/AddTrip/Trips';
import Layout from './pages/Layout';
import Hotels from './pages/Hotels/Hotels';

export default function App() {
	return (
		<>
			<Routes>
				<Route element={<Layout/>}>
					<Route index path="/" element={<Home/>}/>
					<Route path="/airports/new" element={<AddAirport/>}/>
					<Route path="/flights/new" element={<AddFlight/>}/>
					<Route path="/hotels" element={<Hotels/>}/>
					<Route path="/hotels/:hotelID" element={<Hotel/>}/>
					<Route path="/hotels/new" element={<NewHotel/>}/>
					<Route path="/bookTrip" element={<Trips/>}/>
				</Route>
			</Routes>
		</>
	)
}