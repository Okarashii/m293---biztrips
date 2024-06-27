import { useState, useEffect } from "react"

export default function Flights() {
	
	return (
		<form className="grid grid-cols-2 w-fit">
			<label htmlFor="fromid">Abflugsort</label>
			<select name="fromid" id="fromid">
				<option value=""></option>
			</select>
		</form>
	)
}