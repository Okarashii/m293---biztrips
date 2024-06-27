const baseUrl = process.env.REACT_APP_API_BASE_URL;

export async function createAirport(airport) {
	console.log("POST ", airport, " to ", baseUrl);
	const response = await fetch(baseUrl + "airports", {
		method: "POST",
		body: JSON.stringify(airport)
	});

	return response
}

export async function getAirports(id) {
	const response = await fetch(baseUrl + "airports");
	if (response.ok) {return response.json();}
	throw response;
}