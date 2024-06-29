import { useLoaderData, Form, useFormAction } from "react-router-dom";
import { getHotel, getRooms, addRoom, deleteRoom } from '../../services/hotelServices';
import { getAirport } from '../../services/airportServices';
import { useState } from "react";

export const hotelLoader = async ({params}) => {
	console.log(params.hotelID);
	const hotel = await getHotel(params.hotelID);
	const airport = await getAirport(hotel.nearAirportID);
	const allRooms = await getRooms(hotel.id);
	const meetingRooms = allRooms.filter(r => r.isMeetingRoom);
	const rooms = allRooms.filter(r => !r.isMeetingRoom);

	return {
		hotel,
		airport,
		rooms,
		meetingRooms
	}
}

export const hotelAction = async ({params, request}) => {
	const hotelID = Number.parseInt(params.hotelID);
	switch(request.method) {
		case "PUT": {
			const formData = await request.formData();
			const roomNr = formData.get("roomNr");
			const isMeetingRoom = formData.get("isMeetingRoom");
			const capacity = formData.get("capacity");
			const price = formData.get("price");
			const utilities = formData.get("utilities");
			addRoom({
				hotelID,
				roomNr,
				isMeetingRoom,
				capacity,
				price,
				utilities
			});
			return null;
		}
		case "DELETE": {
			const formData = await request.formData();
			const roomIDs = formData.get("roomIDs").split(",").map(r => Number.parseInt(r));
			roomIDs.forEach(async (id) => {
				await deleteRoom(id, params.hotelID);
			})
			return null;
		}
		default: {
			console.log("request method: ", request.method);
			return null;
		}
	}

}

export default function Hotel() {
	const {hotel, airport, meetingRooms, rooms} = useLoaderData();

	return (
		<div className="flex justify-between">
			<div className="flex flex-col w-fit gap-10">
				<HotelData hotel={hotel} airport={airport}/>
				<RoomTable rooms={rooms} heading="Zimmer"/>
				<RoomTable rooms={meetingRooms} heading="Meetingräume"/>
			</div>

			<NewRoomForm/>
		</div>
	)
}

function HotelData({hotel, airport}) {
	return (
		<div className="grid grid-cols-2 gap-x-8 surface w-fit h-fit">
			<h5>Hotel</h5>
			<p>Name</p>
			<p>{hotel.name}</p>
			<p>Addresse</p>
			<p>{hotel.address}</p>
			<p>Stadt</p>
			<p>{hotel.city}</p>
			<p>Vorname</p>
			<p>{hotel.contactFirstname}</p>
			<p>Nachname</p>
			<p>{hotel.contactLastname}</p>
			<p>Email</p>
			<p>{hotel.contactEmail}</p>
			<p>Nahegelegener Flughafen</p>
			<p>{airport.name}</p>
		</div>
	);
}

function RoomTable({heading, rooms}) {
	const [selectedRoomIDs, setSelectedRoomIDs] = useState([]);

	const handleRowClick = (id) => {
		if (selectedRoomIDs.includes(id)) {
			setSelectedRoomIDs([...selectedRoomIDs.filter((i) => i !== id)])
		}
		else {
			setSelectedRoomIDs([...selectedRoomIDs, id])
		}
	}

	return(
		<Form className="surface">
			<h5>{heading}</h5>
			<table>
				<thead className="text-left">
					<th>Nr</th>
					<th>Platz</th>
					<th>Preis</th>
					<th>Details</th>
				</thead>
				<tbody>
					{rooms.map(room => (
						<tr key={room.id} onClick={() => handleRowClick(room.id)}
							aria-selected={selectedRoomIDs.includes(room.id)}
							className="hover:bg-slate-800 aria-selected:bg-slate-400">
							<td>{room.roomNr}</td>
							<td>{room.capacity}</td>
							<td>CHF {room.price}</td>
							<td>{room.utilities}</td>
						</tr>
					))}
				</tbody>
			</table>

			<input type="hidden" name="roomIDs" value={selectedRoomIDs}/>

			<button type="submit" formMethod="delete" disabled={selectedRoomIDs.length === 0}>Auswahl Entfernen</button>
		</Form>
	)
}

function NewRoomForm() {
	return (
		<Form className="surface grid grid-cols-2 h-fit justify-items-start w-fit gap-y-2 bg-slate-600 rounded-xl p-4" method="put" navigate={false}>
			<h5>Raum Hinzufügen</h5>
			{/* <input type="hidden" name="hotelID"/> */}
			<label htmlFor="isMeetingRoom">Meetingraum</label>
			<input type="checkbox" name="isMeetingRoom"/>
			<label htmlFor="roomNr">Nr</label>
			<input type="text" name="roomNr"/>
			<label htmlFor="capacity">Platz</label>
			<input type="number" min={1} name="capacity"/>
			<label htmlFor="price">Preis in CHF</label>
			<input type="number" step={0.01} min={0.01} name="price"/>
			<label htmlFor="utilities">Details</label>
			<input type="text" name="utilities"/>

			<span className="flex justify-end gap-4 w-full col-span-full mt-4">
				<button type="reset">Zurücksetzen</button>
				<button type="submit">Hinzufügen</button>
			</span>
		</Form>
	)
}