const baseUrl = process.env.REACT_APP_API_BASE_URL;

export async function getHotel(id) {
	const hotelRes = await fetch(baseUrl + "hotels/" + id);
	if (hotelRes.ok) {
		const hotel = await hotelRes.json();
		const airportRes = await fetch(baseUrl + "airports/" + hotel.nearAirportID);
		const airport = await airportRes.json();
		console.log("airport: ", airport);

		return {
			hotel, airport
		}
	}
	throw hotelRes;
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

	if (response.ok) {
		const rooms = await response.json();
		// const hotelRooms = rooms.filter(r => r.hotelID === hotelID);
		// const hotelRooms = rooms.filter(r => r.hotelID === hotelID);
		// console.log("rooms Length for", hotelID, rooms);
		return rooms;
	}

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

export async function updateRoom(room) {
	const response = await fetch(baseUrl + "hotels/" + room.hotelID + "/rooms/" + room.id, {
		headers: {
			"Content-Type": "application/json",
		},
		method: "PATCH",
		body: JSON.stringify(room)
	});

	return response;
}