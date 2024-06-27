import { useState, useEffect } from "react"
import { getFlights } from "../services/flightServices";

export default function Flights() {
	const [airports, setAirports] = useState([]);

	useEffect(() => {
		getFlights().then(r => setAirports(r))
	}, [])

	return (
		<form className="grid grid-cols-2 w-fit">
			<label htmlFor="fromid">Abflugsort</label>
			<select name="fromid" id="fromid">
				<option value=""></option>
			</select>
		</form>
	)
}