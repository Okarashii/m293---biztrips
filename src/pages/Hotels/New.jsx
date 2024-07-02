import { useState, useEffect } from "react";
import { Form } from "react-router-dom";
import { getAirports } from "../../services/airportServices";
import { createHotel } from "../../services/hotelServices";
import { useLoaderData, redirect } from "react-router-dom";

export const addHotelLoader = async () => {
	return await getAirports();
}

export const newHotelAction = async ({request}) => {
	const formData = await request.formData();

	const name = formData.get("name");
	const address = formData.get("address");
	const city = formData.get("city");
	const contactFirstname = formData.get("contactFirstname");
	const contactLastname = formData.get("contactLastname");
	const contactEmail = formData.get("contactEmail");
	const nearAirportID = formData.get("nearAirportID");

	const hotel = await createHotel({
		name,
		address,
		city,
		contactFirstname,
		contactLastname,
		contactEmail,
		nearAirportID
	});

	return redirect("/hotels/" + hotel.id);
}

export default function NewHotel() {
	const [airportList, setAirportList] = useState([]);
	useEffect(() => {
		getAirports().then(a => setAirportList(a));
	}, [])

	return (
		<form className="grid grid-cols-2 w-fit bg-slate-700 p-4 rounded-lg" method="POST" action="/hotels/new">
			<label htmlFor="name">Name</label>
			<input required type="text" name="name"/>
			<label htmlFor="address">Adresse</label>
			<input required type="text" name="address"/>
			<label htmlFor="city">Stadt</label>
			<input required type="text" name="city"/>
			<h4 className="text-xl col-span-2">Kontaktperson</h4>
			<label htmlFor="contactFirstname">Vorname</label>
			<input required type="text" name="contactFirstname"/>
			<label htmlFor="contactLastname">Nachname</label>
			<input required type="text" name="contactLastname"/>
			<label htmlFor="contactEmail">Email</label>
			<input required type="text" name="contactEmail"/>

			<label htmlFor="nearAirportID">Nahegelegener Flughafen</label>
			<select name="nearAirportID">
				{airportList.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
			</select>

			<button type="submit">Hinzufügen</button>
		</form>
	)
}