import { getAirport } from "./airportServices";

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

export async function getHotels({airportID, country, city}) {
	let params = airportID || country || city ? "?" : "";
	if (airportID) params += "nearAirportID=" + airportID;

	const response = await fetch(baseUrl + "hotels" + params);
	const hotels = await response.json();
	if (response.ok) {
		return hotels;
	}
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