import { useEffect, useState } from "react";
import { getAirports } from "../services/airportServices";

export default function Hotels() {
	const [airports, setAirports] = useState([]);

	useEffect(() => {
		getAirports().then(r => {
			console.log(r);
			setAirports(r)
		})
	}, [])

	return (
		<form className="grid grid-cols-2 w-fit bg-slate-700 p-4 rounded-lg">
			<label htmlFor="name">Name</label>
			<input type="text" name="name"/>
			<label htmlFor="address">Adresse</label>
			<input type="text" name="address"/>
			<label htmlFor="city">Stadt</label>
			<input type="text" name="city"/>
			<h4 className="text-xl col-span-2">Kontaktperson</h4>
			<label htmlFor="contactFirstname">Vorname</label>
			<input type="text" name="contactFirstname"/>
			<label htmlFor="contactLastname">Nachname</label>
			<input type="text" name="contactLastname"/>
			<label htmlFor="contactEmail">Email</label>
			<input type="text" name="contactEmail"/>

			<label htmlFor="nearAirport">Nahegelegener Flughafen</label>
			<select name="nearAirport">
				{airports.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
			</select>

			<button type="submit">Hinzufügen</button>
		</form>
	)
}