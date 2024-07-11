import { useState } from 'react';

export default function Trips() {
	const [startDate, setStartDate] = useState([]);
	const [endDate, setEndDate] = useState([]);
	const [city, setCity] = useState("");
	const [hotelID, setHotelID] = useState(0);
	const [meetings, setMeetings] = useState([]);
	const [participants, setParticipants] = useState([]);

	const handleNewMeeting = () => {

	}

	const handleNewParticipant = () => {

	}

	const handleTicketDetails = (planeTickets) => {

	}

	return (
		<div className="flex flex-col gap-8 w-[48rem]">
			<div className="surface grid grid-cols-4 w-full gap-2">
				<label htmlFor="startDate">Startdatum</label>
				<input name="startDate" type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
				<label htmlFor="endDate">Enddatum</label>
				<input name="endDate" type="text" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
				<label htmlFor="city">Stadt</label>
				<input name="city" type="text" value={city} onChange={(e) => setCity(e.target.value)}/>
				<label htmlFor="hotel">Hotel</label>
				<select name="hotel">

				</select>
			</div>

			<section id="meetings" className="surface flex flex-col w-full">
				<span className="flex justify-between mb-4">
					<h4>Meetings</h4>
					<button onClick={handleNewMeeting}>Neues Meeting</button>
				</span>

				<table>
					<tr>
						<th className="text-left">Raum</th>
						<th className="text-left">Datum</th>
						<th className="text-left">Startzeit</th>
						<th className="text-left">Endzeit</th>
					</tr>
					{meetings.map(({date, startTime, endTime, roomNr, id}) => (
						<tr key={id}>
							<td>{roomNr}</td>
							<td>{date}</td>
							<td>{startTime}</td>
							<td>{endTime}</td>
						</tr>
					))}
				</table>
			</section>

			<section id="participants" className="surface flex flex-col w-full">
				<span className="flex justify-between mb-4">
					<h4>Teilnehmer</h4>
					<button onClick={handleNewParticipant}>Teilnehmer hinzufügen</button>
				</span>

				<table>
					<tr>
						<th className="text-left">Vorname</th>
						<th className="text-left">Nachname</th>
						<th className="text-left">Hotelbuchungen</th>
						<th className="text-left">Flugtickets</th>
					</tr>
					{participants.map(({id, firstname, lastname, planeTickets, hotelRoom}) => (
						<tr key={id}>
							<td>{firstname}</td>
							<td>{lastname}</td>
							<td>{hotelRoom.roomNr}</td>
							<td><button className="underlined bg-transparent p-0" onClick={() => handleTicketDetails(planeTickets)}>details</button></td>
						</tr>
					))}
				</table>
			</section>
		</div>
	)
}