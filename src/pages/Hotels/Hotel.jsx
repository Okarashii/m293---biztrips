import { useLoaderData } from "react-router-dom";
import { getHotel } from '../../services/hotelServices';
import { getAirport } from '../../services/airportServices';

export const hotelLoader = async ({params}) => {
	console.log(params.hotelID);
	const hotel = await getHotel(params.hotelID);
	const airport = await getAirport(hotel.nearAirportID);

	return {
		hotel, airport
	}
}

export default function Hotel() {
	const {hotel, airport} = useLoaderData();

	return (
		<div className="grid grid-cols-2 w-fit bg-slate-700 p-4 rounded-lg">
			<p>Name</p>
			<p>{hotel.name}</p>
			<p>Addresse</p>
			<p>{hotel.address}</p>
			<p>Stadt</p>
			<p>{hotel.city}</p>
			<p>Vorname</p>
			<p>{hotel.contactFirstname}</p>
			<p>Nachname</p>
			<p>{hotel.contactLastname}</p>
			<p>Email</p>
			<p>{hotel.contactEmail}</p>
			<p>Nahegelegener Flughafen</p>
			<p>{airport.name}</p>
		</div>
	)
}