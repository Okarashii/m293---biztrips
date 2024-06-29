import { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { getAirports } from "../../services/airportServices";
import { createHotel } from "../../services/hotelServices";
import { Navigate, redirect } from "react-router-dom";

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

export default function AddHotel() {
	const [airportList, setAirportList] = useState([]);

	const [name, setName] = useState(undefined);
	const [address, setAddress] = useState(undefined);
	const [city, setCity] = useState(undefined);
	const [contactFirstname, setFirstname] = useState(undefined);
	const [contactLastname, setLastname] = useState(undefined);
	const [contactEmail, setEmail] = useState(undefined);
	const [nearAirportID, setAirport] = useState(undefined);
	const [id, setID] = useState(null);

	useEffect(() => {
		getAirports().then(r => {
			console.log(r);
			setAirportList(r)
		})
	}, [])

	const onSubmit = (e) => {
		e.preventDefault();
		console.log("name ", name);
		console.log("address ", address);
		console.log("city ", city);
		console.log("firstname ", contactFirstname);
		console.log("lastname ", contactLastname);
		console.log("email ", contactEmail);
		console.log("airport ", nearAirportID);

		createHotel({
			name,
			address,
			city,
			contactFirstname,
			contactLastname,
			contactEmail,
			nearAirportID
		}).then((res) => {
			if (res) {
				setID(res.id);
			}
		})
	}

	return (
		// <form className="grid grid-cols-2 w-fit bg-slate-700 p-4 rounded-lg" method="POST">
		// 	{/* {id && <Navigate to={"/hotels/" + id}/>} */}
		// 	<label htmlFor="name">Name</label>
		// 	<input required type="text" name="name" value={name} onChange={(e) => setName(e.currentTarget.value)}/>
		// 	<label htmlFor="address">Adresse</label>
		// 	<input required type="text" name="address" value={address} onChange={(e) => setAddress(e.currentTarget.value)}/>
		// 	<label htmlFor="city">Stadt</label>
		// 	<input required type="text" name="city" value={city} onChange={(e) => setCity(e.currentTarget.value)}/>
		// 	<h4 className="text-xl col-span-2">Kontaktperson</h4>
		// 	<label htmlFor="contactFirstname">Vorname</label>
		// 	<input required type="text" name="contactFirstname" value={contactFirstname} onChange={(e) => setFirstname(e.currentTarget.value)}/>
		// 	<label htmlFor="contactLastname">Nachname</label>
		// 	<input required type="text" name="contactLastname" value={contactLastname} onChange={(e) => setLastname(e.currentTarget.value)}/>
		// 	<label htmlFor="contactEmail">Email</label>
		// 	<input required type="text" name="contactEmail" value={contactEmail} onChange={(e) => setEmail(e.currentTarget.value)}/>

		// 	<label htmlFor="nearAirport">Nahegelegener Flughafen</label>
		// 	<select name="nearAirport" onChange={(e)=> setAirport(e.currentTarget.value)} value={nearAirportID}>
		// 		{airportList.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
		// 	</select>

		// 	<button type="submit">Hinzufügen</button>
		// </form>

		<Form className="grid grid-cols-2 w-fit bg-slate-700 p-4 rounded-lg" method="POST" action="/hotels/new">
			{/* {id && <Navigate to={"/hotels/" + id}/>} */}
			<label htmlFor="name">Name</label>
			<input required type="text" name="name" value={name} onChange={(e) => setName(e.currentTarget.value)}/>
			<label htmlFor="address">Adresse</label>
			<input required type="text" name="address" value={address} onChange={(e) => setAddress(e.currentTarget.value)}/>
			<label htmlFor="city">Stadt</label>
			<input required type="text" name="city" value={city} onChange={(e) => setCity(e.currentTarget.value)}/>
			<h4 className="text-xl col-span-2">Kontaktperson</h4>
			<label htmlFor="contactFirstname">Vorname</label>
			<input required type="text" name="contactFirstname" value={contactFirstname} onChange={(e) => setFirstname(e.currentTarget.value)}/>
			<label htmlFor="contactLastname">Nachname</label>
			<input required type="text" name="contactLastname" value={contactLastname} onChange={(e) => setLastname(e.currentTarget.value)}/>
			<label htmlFor="contactEmail">Email</label>
			<input required type="text" name="contactEmail" value={contactEmail} onChange={(e) => setEmail(e.currentTarget.value)}/>

			<label htmlFor="nearAirportID">Nahegelegener Flughafen</label>
			<select name="nearAirportID" onChange={(e)=> setAirport(e.currentTarget.value)} value={nearAirportID}>
				{airportList.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
			</select>

			<button type="submit">Hinzufügen</button>
		</Form>
	)
}