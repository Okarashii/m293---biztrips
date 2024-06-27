const baseUrl = process.env.REACT_APP_API_BASE_URL;

export async function getFlights() {
	const response = await fetch(baseUrl + "flights");
	if (response.ok) {return response.json();}
	throw response;
}