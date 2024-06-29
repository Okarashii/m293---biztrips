import { useLoaderData, Form, useFormAction, useParams } from "react-router-dom";
import { getHotel, getRooms, addRoom, deleteRoom, updateRoom } from '../../services/hotelServices';
import { getAirport } from '../../services/airportServices';
import { forwardRef, useEffect, useRef, useState } from "react";

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
	const formData = await request.formData();

	const id = Number.parseInt(formData.get("id"));
	const roomNr = formData.get("roomNr");
	const isMeetingRoom = formData.get("isMeetingRoom");
	const capacity = Number.parseInt(formData.get("capacity"));
	const price = Number.parseFloat(formData.get("price"));
	const utilities = formData.get("utilities");

	switch(request.method) {
		case "PUT": {
			// const formData = await request.formData();
			// const roomNr = formData.get("roomNr");
			// const isMeetingRoom = formData.get("isMeetingRoom");
			// const capacity = formData.get("capacity");
			// const price = formData.get("price");
			// const utilities = formData.get("utilities");
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
			});
			return null;
		}
		case "PATCH": {
			return await updateRoom({
				id, hotelID, roomNr, isMeetingRoom, capacity, price, utilities
			});
		}
		default: {
			console.log("request method: ", request.method);
			return null;
		}
	}

}

export default function Hotel() {
	const {hotel, airport, meetingRooms, rooms} = useLoaderData();
	const [roomModalContents, setRoomModalContents] = useState(undefined);

	return (
		<div className="flex justify-between">
			<div className="flex flex-col w-fit gap-10">
				<span className="flex gap-4">
					<HotelData hotel={hotel} airport={airport}/>
					<button className="h-fit" onClick={() => setRoomModalContents(null)}>Neuer Raum Hinzufügen</button>
				</span>
				<RoomTable rooms={rooms} heading="Zimmer" openEditModal={setRoomModalContents}/>
				<RoomTable rooms={meetingRooms} heading="Meetingräume" openEditModal={setRoomModalContents}/>
			</div>

			{ roomModalContents !== undefined ? <NewRoomForm roomData={roomModalContents} close={() => setRoomModalContents(undefined)}/> : null }
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

function RoomTable({heading, rooms, openEditModal}) {
	const [selectedRoomIDs, setSelectedRoomIDs] = useState([]);
	const [editRoomID, setEditRoomID] = useState(null);
	const [deleteRoomID, setDeleteRoomID] = useState(null);

	const handleRowClick = (id) => {
		if (selectedRoomIDs.includes(id)) {
			setSelectedRoomIDs([...selectedRoomIDs.filter((i) => i !== id)])
		}
		else {
			setSelectedRoomIDs([...selectedRoomIDs, id])
		}
	}

	const handleEditClick = (roomID) => {
		if (editRoomID !== roomID) setEditRoomID(roomID);
		else {
			setEditRoomID(null);
		}
	}

	const handleCancelClick = (roomID) => {
		if (editRoomID !== null) setEditRoomID(null)
		else setDeleteRoomID(roomID)
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
					<th>Edit</th>
				</thead>
				<tbody>
					{rooms.map(room => (
						<tr key={room.id} onClick={() => handleRowClick(room.id)}
							aria-selected={selectedRoomIDs.includes(room.id)}
							className="hover:bg-slate-800 aria-selected:bg-slate-400">

							<td><input type="text" value={room.roomNr} readOnly={room.id !== editRoomID}/></td>
							<td><input type="number" min={0} value={room.capacity} readOnly={room.id !== editRoomID}/></td>
							<td>CHF <input type="number" step={0.01} min={0.01} value={room.price} readOnly={room.id !== editRoomID}/></td>
							<td><input className="truncate" type="text" value={room.utilities} readOnly={room.id !== editRoomID}/></td>
							<td>
								<button className="p-0 bg-transparent" onClick={() => openEditModal(room)}>✏</button>
								<button className="p-0 bg-transparent" onClick={() => handleCancelClick(room.id)}>❌</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<input type="hidden" name="roomIDs" value={selectedRoomIDs}/>

			<button className="disabled:text-gray-500" type="submit" formMethod="delete" disabled={selectedRoomIDs.length === 0}>Auswahl Entfernen</button>
		</Form>
	)
}

function NewRoomForm({roomData, close}) {
	console.log("RoomData: ", roomData);
	const { id, isMeetingRoom, roomNr, capacity, price, utilities } = roomData ?? { id:undefined, isMeetingRoom: false, roomNr: undefined, capacity: undefined, price: undefined, utilities: undefined };

	return (
		<dialog open>
			<Form className="surface grid grid-cols-2 h-fit justify-items-start w-fit gap-y-2 bg-slate-600 rounded-xl p-4" method={roomData ? "patch" : "put"} navigate={false} onReset={close} onSubmit={close}>
				<h5>Raum Hinzufügen</h5>
				<input type="hidden" name="id" value={id}/>
				<label htmlFor="isMeetingRoom">Meetingraum</label>
				<input defaultChecked={isMeetingRoom} type="checkbox" name="isMeetingRoom"/>
				<label htmlFor="roomNr">Nr</label>
				<input defaultValue={roomNr} required type="text" name="roomNr"/>
				<label htmlFor="capacity">Platz</label>
				<input defaultValue={capacity} required type="number" min={1} name="capacity"/>
				<label htmlFor="price">Preis in CHF</label>
				<input defaultValue={price} required type="number" step={0.01} min={0.01} name="price"/>
				<label htmlFor="utilities">Details</label>
				<input defaultValue={utilities} required type="text" name="utilities"/>

				<span className="flex justify-end gap-4 w-full col-span-full mt-4">
					<button type="reset">Abbrechen</button>
					<button type="submit">Hinzufügen</button>
				</span>
			</Form>
		</dialog>
	)
}