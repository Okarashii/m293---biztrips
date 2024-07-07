import { useState, useEffect } from "react"
import { getHotels } from "../../services/hotelServices";
import { getAirport } from "../../services/airportServices";

export default function Hotels() {
	const [hotelList, setHotelList] = useState([]);

	useEffect(() => {
		getHotels({}).then(h => {
			setHotelList(h);
			console.log(h);
		});
	}, [])

	return (
		<div>
			<h1>Wählend Sie ein Hotel aus</h1>
			<div className="grid grid-cols-4 bg-slate-950 w-full h-fit rounded-lg p-8 gap-8">
				{hotelList.map(({id, name, city, nearAirportIATA, img}) => <HotelCard key={id} id={id} name={name} city={city} airportIATA={nearAirportIATA} img={img}/>)}
			</div>
		</div>
	)
}

function HotelCard({id, name, city, airportIATA, img}) {
	const [country, setCountry] = useState("");
	useEffect(() => {
		getAirport(airportIATA).then(a => {
			console.log("Airport with code", airportIATA, ":", a);
			setCountry(a[0].country);
		});
	})

	return (
		<a href={"#hotels/" + id} className="w-15 h-fit bg-slate-800 rounded-lg overflow-clip">
			<img src={process.env.PUBLIC_URL + img} alt="hotelImage" className="w-full aspect-video"/>
			<div className="mt-4 p-8 flex flex-col justify-center items-center">
				<h4>{name}</h4>
				<h6>{city}, {country}</h6>
			</div>
		</a>
	)
}