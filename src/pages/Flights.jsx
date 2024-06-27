import { useState, useEffect } from "react"
import { getFlights } from "../services/flightServices";
import { getAirports } from '../services/airportServices';

export default function Flights() {
	const [airports, setAirports] = useState([]);

	useEffect(() => {
		getAirports().then(r => {
			console.log(r);
			setAirports(r)
		})
	}, [])

	return (
		<form>
			<label htmlFor="fromid">Abflugshafen</label>
			<select name="fromid">
				{airports.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
			</select>

			<label htmlFor="toid">Landehafen</label>
			<select name="toid">
				{airports.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
			</select>

			<label htmlFor="airline">Airline</label>
			<input type="text" name="airline"/>

			<h5 className="col-span-2 justify-self-start text-xl">Preise</h5>

			<label htmlFor="economy">Economy</label>
			<input type="number" name="economy"/>
			<label htmlFor="premiumEconomy">Premium Economy</label>
			<input type="number" name="premiumEconomy"/>
			<label htmlFor="business">Business</label>
			<input type="number" name="business"/>
			<label htmlFor="first">First Class</label>
			<input type="number" name="first"/>

			<button type="submit">Hinzufügen</button>
		</form>
	)
}