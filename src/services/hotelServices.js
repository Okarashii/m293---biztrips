import { getAirport } from "./airportServices";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export async function getHotel(id) {
	const hotelRes = await fetch(baseUrl + "hotels/" + id);
	if (hotelRes.ok) {
		const hotel = await hotelRes.json();
		const airportRes = await fetch(baseUrl + "airports/" + hotel.nearAirportIATA);
		const airport = await airportRes.json();

		return {
			hotel, airport: airport[0]
		}
	}
	throw hotelRes;
}

export async function getHotels({nearAirportIATA, city}) {
	let params = nearAirportIATA || city ? "?" : "";
	// if (nearAirportIATA) params += "nearAirportID=" + nearAirportIATA;

	const response = await fetch(baseUrl + "hotels");
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

export async function addRoom({hotelID, roomNr, capacity, price, isMeetingRoom}) {
	const response = await fetch(baseUrl + "hotels/" + hotelID + "/rooms", {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({hotelID: Number.parseInt(hotelID), roomNr, capacity, price, isMeetingRoom})
	});

	return response;
}

export async function deleteRoom(roomNr, hotelID) {
	const room = await fetch(baseUrl + "hotels/" + hotelID + "/rooms/" + roomNr);
	const roomData = await room.json();

	const response = await fetch(baseUrl + "rooms/" + roomData[0].id, {
		method: "DELETE"
	});

	return response;
}

export async function updateRoom({hotelID, price, capacity, isMeetingRoom, roomNr}) {
	const room = await fetch(baseUrl + "hotels/" + hotelID + "/rooms/" + roomNr);
	const roomData = await room.json();

	const response = await fetch(baseUrl + "rooms/" + roomData[0].id, {
		headers: {
			"Content-Type": "application/json",
		},
		method: "PATCH",
		body: JSON.stringify({price, capacity, isMeetingRoom})
	});

	return response;
}