import { useState } from "react";
import { createAirport } from "../services/airportServices";

export default function Airports() {
	const [name, setName] = useState("");
	const [code, setCode] = useState("");
	const [country, setCountry] = useState("");
	const [city, setCity] = useState("");
	const [statusOk, setStatusOk] = useState(true);
	const [statusText, setStatusText] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		createAirport({name, code, country, city}).then(r => {
			setStatusOk(r.ok);
			if (r.ok) setStatusText("Flughafen hinzugefügt!");
			else setStatusText(r.status + ": " + r.statusText);
		});
	}

	return (
		<form onSubmit={handleSubmit }>
			<label htmlFor="name">Name</label>
			<input className="border border-black" name="name" id="name" value={name} required onChange={e => setName(e.currentTarget.value)}/>
			<label htmlFor="code">Code</label>
			<input className="border border-black" name="code" id="code" value={code} required onChange={e => setCode(e.currentTarget.value)}/>
			<label htmlFor="country">Land</label>
			<input className="border border-black" name="country" id="county" value={country} required onChange={e => setCountry(e.currentTarget.value)}/>
			<label htmlFor="city">Stadt</label>
			<input className="border border-black" name="city" id="city" value={city} required onChange={e => setCity(e.currentTarget.value)}/>
			{statusText === "" ? null : statusOk ? <p className="col-span-2 justify-self-center">{statusOk}</p> : <p className="col-span-2 justify-self-center text-red-500">{statusOk}</p> }
			<button className="px-4 py-1 bg-slate-700 rounded-lg col-span-2 w-fit justify-self-end" type="submit">Hinzufügen</button>
		</form>
	)
}