import { useState, useEffect } from "react";
import { Form } from "react-router-dom";
import { getAirports } from "../../services/airportServices";
import { createHotel } from "../../services/hotelServices";
import { useLoaderData, Navigate } from "react-router-dom";

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

	// return redirect("/hotels/" + hotel.id);
}

export default function NewHotel() {
	const [airportList, setAirportList] = useState([]);
	const [name, setName] = useState("");
	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [airportIATA, setAirportIATA] = useState("");
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [hotelID, setHotelID] = useState(null);
	useEffect(() => {
		getAirports().then(a => setAirportList(a));
	}, [])

	const handleSubmit = (e) => {
		e.preventDefault();
		createHotel({
			name,
			address,
			city,
			contactFirstname: firstname,
			contactLastname: lastname,
			contactEmail: email,
			nearAirportIATA: airportIATA
		})
		.then((data) => setHotelID(data.id))
	}

	return (
		<form className="grid grid-cols-2 w-fit bg-slate-700 p-4 rounded-lg gap-y-2" onSubmit={handleSubmit}>
			<h4 className="text-xl col-span-2">Hoteldaten</h4>
			<label htmlFor="name">Name</label>
			<input required type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}/>
			<label htmlFor="address">Adresse</label>
			<input required type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)}/>
			<label htmlFor="city">Stadt</label>
			<input required type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)}/>
			<label htmlFor="nearAirportID">Nahegelegener Flughafen</label>
			<select name="nearAirportID" value={airportIATA}>
				{airportList.map(a => <option key={a.id} value={a.iataCode} onClick={(e) => setAirportIATA(e.target.value)}>{a.name}</option>)}
			</select>
			<h4 className="text-xl col-span-2 mt-4">Kontaktperson</h4>
			<label htmlFor="contactFirstname">Vorname</label>
			<input required type="text" name="contactFirstname" value={firstname} onChange={(e) => setFirstname(e.target.value)}/>
			<label htmlFor="contactLastname">Nachname</label>
			<input required type="text" name="contactLastname" value={lastname} onChange={(e) => setLastname(e.target.value)}/>
			<label htmlFor="contactEmail">Email</label>
			<input required type="text" name="contactEmail" value={email} onChange={(e) => setEmail(e.target.value)}/>
			<button type="submit">Bestätigen</button>

			{hotelID === null ? null : <Navigate to={"/hotels/" + hotelID}/>}
		</form>
	)
}