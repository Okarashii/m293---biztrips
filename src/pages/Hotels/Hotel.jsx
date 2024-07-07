import { useParams } from 'react-router-dom';
import { getHotel, getRooms, addRoom, deleteRoom, updateRoom } from '../../services/hotelServices';
import { useState, useEffect } from "react";

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
		case "POST": {
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
	const [hotel, setHotel] = useState({});
	const [airport, setAirport] = useState("");
	const [rooms, setRooms] = useState([]);
	const [roomNr, setRoomNr] = useState("");
	const [roomCapacity, setRoomCapacity] = useState(0);
	const [roomPrice, setRoomPrice] = useState(0);
	const [roomIsMeeting, setRoomIsMeeting] = useState(false);
	const {hotelID} = useParams();
	const [addNewRoom, setAddNewRoom] = useState(false);
	const [changeRoom, setChangeRoom] = useState(false);

	useEffect(() => {
		getHotel(hotelID)
			.then(({hotel, airport}) => {
				setHotel(hotel);
				setAirport(airport);
			});
		getRooms(hotelID)
			.then(r => setRooms(r));
	}, [])

	const handleRoomSubmit = (e) => {
		e.preventDefault();
		if (addNewRoom) {
			addRoom({
				hotelID,
				roomNr,
				price: roomPrice,
				capacity: roomCapacity,
				isMeetingRoom: roomIsMeeting
			}).then((r) => {
				setRoomNr("");
				setRoomCapacity(0);
				setRoomPrice(0);
				setRoomIsMeeting(false);
				setAddNewRoom(false);
				setChangeRoom(false);
			})
			.then((d) => {
				getRooms(hotelID).then(r => setRooms(r));
			})
		}
		else {
			updateRoom({
				hotelID,
				roomNr,
				price: roomPrice,
				capacity: roomCapacity,
				isMeetingRoom: roomIsMeeting
			}).then((r) => {
				setRoomNr("");
				setRoomCapacity(0);
				setRoomPrice(0);
				setRoomIsMeeting(false);
				setAddNewRoom(false);
				setChangeRoom(false);
			})
			.then((d) => {
				getRooms(hotelID).then(r => setRooms(r));
			})
		}
	}

	const handleRoomEdit = (room) => {
		setRoomNr(room.roomNr);
		setRoomCapacity(room.capacity);
		setRoomPrice(room.price);
		setRoomIsMeeting(room.isMeetingRoom);
		setChangeRoom(true);
	}

	const handleRoomDelete = (room) => {
		deleteRoom(room.roomNr, hotelID)
		.then((d) => {
			getRooms(hotelID).then(r => setRooms(r));
		})
	}

	function renderRoom(room) {
		return (
			<tr key={room.id}>
				<td>{room.roomNr}</td>
				<td>{room.capacity}</td>
				<td>CHF {room.price}</td>
				<td>
					<button className="p-0 bg-transparent" onClick={() => handleRoomEdit(room)}>✏</button>
					<button className="p-0 bg-transparent" onClick={() => handleRoomDelete(room)}>❌</button>
				</td>
			</tr>
		)
	}

	return (
		<div className="flex justify-between w-fit gap-16">
			<div className="flex flex-col w-fit gap-10">
				<span className="flex gap-4">
					<HotelData hotel={hotel} airport={airport}/>
					<button data-disabled={addNewRoom} className="data-[disabled=true]:grayed-out h-fit" onClick={() => setAddNewRoom(true)}>Neuer Raum Hinzufügen</button>
				</span>
				<div className="surface">
					<h5>Zimmer</h5>
					<table className='w-full'>
						<thead>
							<tr className="text-left">
								<th>Nr</th>
								<th>Platz</th>
								<th>Preis</th>
								<th>Edit</th>
							</tr>
						</thead>
						<tbody>
							{rooms.filter(({isMeetingRoom}) => !isMeetingRoom).map(renderRoom)}
						</tbody>
					</table>
				</div>

				<div className="surface">
					<h5>Meeting Räume</h5>
					<table className='w-full'>
						<thead>
							<tr className="text-left">
								<th>Nr</th>
								<th>Platz</th>
								<th>Preis</th>
								<th>Edit</th>
							</tr>
						</thead>
						<tbody>
							{rooms.filter(({isMeetingRoom}) => isMeetingRoom).map(renderRoom)}
						</tbody>
					</table>
				</div>
			</div>

			<form onSubmit={handleRoomSubmit}  data-disabled={!addNewRoom && !changeRoom} className="data-[disabled=true]:grayed-out surface bg-slate-600 rounded-xl p-4 grid grid-cols-2 h-fit justify-items-start w-fit gap-y-2">
				<h5>Raum details</h5>
				<label htmlFor="isMeetingRoom">Meetingraum</label>
				<input type="checkbox" name="isMeetingRoom" value={roomIsMeeting} onChange={(e) => setRoomIsMeeting(e.target.value)}/>
				<label htmlFor="roomNr">Nr</label>
				<input required readOnly={!addNewRoom && changeRoom} className='read-only:grayed-out' type="text" name="roomNr" value={roomNr} onChange={(e) => setRoomNr(e.target.value)}/>
				<label htmlFor="capacity">Platz</label>
				<input required type="number" min={1} name="capacity" value={roomCapacity} onChange={(e) => setRoomCapacity(e.target.value)}/>
				<label htmlFor="price">Preis in CHF</label>
				<input required type="number" step={0.01} min={0.01} name="price" value={roomPrice} onChange={(e) => setRoomPrice(e.target.value)}/>
				<span className="flex justify-end gap-4 w-full col-span-full mt-4">
					<button className='h-fit bg-slate-700' type="submit">Bestätigen</button>
					<button className='h-fit bg-slate-700' type="reset">Abbrechen</button>
				</span>
			</form>
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