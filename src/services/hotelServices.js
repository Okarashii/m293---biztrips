const baseUrl = process.env.REACT_APP_API_BASE_URL;

export async function getHotel(hotelID) {
	const response = await fetch(baseUrl + "hotels/" + hotelID);
	if (response.ok) {return response.json();}
	throw response;
}

export async function getHotels({airportCode, country, city}) {
	const response = await fetch(baseUrl + "hotels");
	const hotels = await response.json();
	
	throw response;
}

export async function createHotel(hotel) {
	console.log(hotel);
	const response = await fetch(baseUrl + "hotels", {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(hotel)
	});

	if (response.ok) return response.json();
	return null;
}