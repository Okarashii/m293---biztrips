import { useLoaderData, Await, defer } from "react-router-dom";
import { Suspense } from "react";
import { getHotel, getRooms, addRoom, deleteRoom, updateRoom } from '../../services/hotelServices';
import { getAirport } from '../../services/airportServices';
import { useState } from "react";
import FormModal from "../../components/FormModal";

export const hotelLoader = async ({params}) => {
	console.log(params.hotelID);
	const hotel = await getHotel(params.hotelID);
	const airport = await getAirport(hotel.nearAirportID);
	const rooms = getRooms(hotel.id);

	return defer({
		hotel,
		airport,
		rooms
	});
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
			await deleteRoom(id);
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
	const {hotel, airport, rooms} = useLoaderData();
	const [NewRoomModal, setNewModalOpen] = FormModal("put");

	return (
		<div className="flex justify-between">
			<div className="flex flex-col w-fit gap-10">
				<span className="flex gap-4">
					<HotelData hotel={hotel} airport={airport}/>
					<button className="h-fit" onClick={() => setNewModalOpen(true)}>Neuer Raum Hinzufügen</button>
				</span>
				<Suspense fallback={<RoomTableLoading/>}>
					<Await resolve={rooms}>
						{
							(rooms) => {
								return (
									<>
										<RoomTable rooms={rooms.filter(r => !r.isMeetingRoom)} heading="Zimmer"/>
										<RoomTable rooms={rooms.filter(r => r.isMeetingRoom)} heading="Meetingräume"/>
									</>
								)
							}
						}
					</Await>
				</Suspense>
			</div>

			<NewRoomModal className="surface bg-slate-600 rounded-xl p-4 grid grid-cols-2 h-fit justify-items-start w-fit gap-y-2">
				<h5>Raum Hinzufügen</h5>
				<label htmlFor="isMeetingRoom">Meetingraum</label>
				<input type="checkbox" name="isMeetingRoom"/>
				<label htmlFor="roomNr">Nr</label>
				<input required type="text" name="roomNr"/>
				<label htmlFor="capacity">Platz</label>
				<input required type="number" min={1} name="capacity"/>
				<label htmlFor="price">Preis in CHF</label>
				<input required type="number" step={0.01} min={0.01} name="price"/>
				<label htmlFor="utilities">Details</label>
				<input required type="text" name="utilities"/>
				<span className="flex justify-end gap-4 w-full col-span-full mt-4">
					<button type="reset">Abbrechen</button>
					<button type="submit">Hinzufügen</button>
				</span>
			</NewRoomModal>
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
	const [selectedRoom, setSelectedRoom] = useState({});
	const [EditRoomModal, setEditModalOpen] = FormModal("patch");
	const [DeleteRoomModal, setDeleteModalOpen] = FormModal("delete");

	const openEditModal = (room) => {
		setSelectedRoom(room);
		setEditModalOpen(true);
	}

	const openDeleteModal = (room) => {
		console.log("roomID Delete:", room);
		setSelectedRoom(room);
		setDeleteModalOpen(true);
	}

	return(
		<>
			<div className="surface">
				<h5>{heading}</h5>
				<table>
					<thead>
						<tr className="text-left">
							<th>Nr</th>
							<th>Platz</th>
							<th>Preis</th>
							<th>Details</th>
							<th>Edit</th>
						</tr>
					</thead>
					<tbody>
						{rooms.map(({id, roomNr, price, capacity, utilities}) => (
							<tr key={id}>
								<td>{roomNr}</td>
								<td>{capacity}</td>
								<td>CHF {price}</td>
								<td>{utilities}</td>
								<td>
									<button className="p-0 bg-transparent" onClick={() => openEditModal({id, roomNr, price, capacity, utilities})}>✏</button>
									<button className="p-0 bg-transparent" onClick={() => openDeleteModal({id, roomNr, price, capacity, utilities})}>❌</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<EditRoomModal className="surface bg-slate-600 rounded-xl p-4 grid grid-cols-2 h-fit justify-items-start w-fit gap-y-2">
				<h5>Raum Hinzufügen</h5>
				<input type="hidden" name="id" value={selectedRoom.id}/>
				<label htmlFor="isMeetingRoom">Meetingraum</label>
				<input defaultChecked={selectedRoom.isMeetingRoom} type="checkbox" name="isMeetingRoom"/>
				<label htmlFor="roomNr">Nr</label>
				<input defaultValue={selectedRoom.roomNr} required type="text" name="roomNr"/>
				<label htmlFor="capacity">Platz</label>
				<input defaultValue={selectedRoom.capacity} required type="number" min={1} name="capacity"/>
				<label htmlFor="price">Preis in CHF</label>
				<input defaultValue={selectedRoom.price} required type="number" step={0.01} min={0.01} name="price"/>
				<label htmlFor="utilities">Details</label>
				<input defaultValue={selectedRoom.utilities} required type="text" name="utilities"/>
				<span className="flex justify-end gap-4 w-full col-span-full mt-4">
					<button type="reset">Abbrechen</button>
					<button type="submit">Bestätigen</button>
				</span>
			</EditRoomModal>

			<DeleteRoomModal className="surface bg-slate-600 rounded-xl p-4 grid grid-cols-2 h-fit justify-items-start w-fit gap-y-2">
				<h6>Soll Raum {selectedRoom.roomNr} wirklich gelöscht werden?</h6>
				<input type="hidden" name="id" value={selectedRoom.id}/>
				<span className="flex justify-end gap-4 w-full col-span-full mt-4">
					<button type="reset">Nein</button>
					<button type="submit">Ja</button>
				</span>
			</DeleteRoomModal>
		</>
	)
}

function RoomTableLoading() {
	return (
		<div className="surface">
			<h5>Laden...</h5>
			<table>
				<thead>
					<tr className="text-left">
						<th>Nr</th>
						<th>Platz</th>
						<th>Preis</th>
						<th>Details</th>
						<th>Edit</th>
					</tr>
				</thead>
				<tbody>
					
				</tbody>
			</table>
		</div>
	);
}