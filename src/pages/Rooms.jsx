import { useState } from "react";

export default function Rooms() {
	const [isMeetingRoom, setIsMeetingRoom] = useState(false);
	const [roomNr, setRoomNr] = useState(undefined);
	const [capacity, setCapcacity] = useState(undefined);
	const [price, setPrice] = useState(undefined);
	const [utilities, setUtilities] = useState(undefined);

	return (
		<form className="grid grid-cols-2 w-fit bg-slate-700 p-4 rounded-lg">
			<label>Meetingraum</label>
			<input type="checkbox" name="isMeetingRoom"/>
			<label>Zimmer Nr.</label>
			<input type="text" name="roomNr"/>
			<label>Kapazität</label>
			<input type="number" min="1" step="1" name="capacity"/>
			<label>Preis</label>
			<input type="number" min="0.01" step="0.01" name="price"/>
			<label>Angebote</label>
			<input type="text" name="utilities"/>
		</form>
	)
}