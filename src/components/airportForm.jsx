import { useState } from "react";

export default function AirportForm() {
	const [name, setName] = useState("");
	const [code, setCode] = useState("");
	const [country, setCountry] = useState("");
	const [city, setCity] = useState("");

	return (
		<form action="" className="grid grid-cols-2 w-fit gap-y-2 bg-slate-600 rounded-xl p-4">
			<label htmlFor="name">Name</label>
			<input className="border border-black" name="name" id="name" value={name} required onChange={e => setName(e.currentTarget.value)}/>
			<label htmlFor="code">Code</label>
			<input className="border border-black" name="code" id="code" value={code} required onChange={e => setCode(e.currentTarget.value)}/>
			<label htmlFor="country">Land</label>
			<input className="border border-black" name="country" id="county" value={country} required onChange={e => setCountry(e.currentTarget.value)}/>
			<label htmlFor="city">Stadt</label>
			<input className="border border-black" name="city" id="city" value={city} required onChange={e => setCity(e.currentTarget.value)}/>
			<button className="px-4 py-1 bg-slate-700 rounded-lg col-span-2 w-fit justify-self-end" type="submit">Hinzufügen</button>
		</form>
	)
}