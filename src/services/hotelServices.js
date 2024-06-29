const baseUrl = process.env.REACT_APP_API_BASE_URL;

export async function getHotel(id) {
	const response = await fetch(baseUrl + "hotels/" + id);
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

export async function getRooms(hotelID) {
	const response = await fetch(baseUrl + "hotels/" + hotelID + "/rooms");
	const rooms = await response.json();
	if (response.ok) {return rooms.filter(r => r.hotelID === hotelID)}
	throw response;
}

export async function addRoom(room) {
	const response = await fetch(baseUrl + "hotels/" + room.hotelID + "/rooms", {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(room)
	});

	return response;
}

export async function deleteRoom(roomID, hotelID) {
	const response = await fetch(baseUrl + "hotels/" + hotelID + "/rooms/" + roomID, {
		method: "DELETE"
	});

	return response;
}