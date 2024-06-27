// import { Link } from "react-router-dom";

export default function Home() {
	return (
		<div className="flex flex-col gap-2">
			<a className="bg-slate-600 px-4 py-2 rounded-lg w-fit" href='/airports'>Flughafen hinzufügen</a>
			<a className="bg-slate-600 px-4 py-2 rounded-lg w-fit" href='/flights'>Flug Hinzufügen</a>
			<a className="bg-slate-600 px-4 py-2 rounded-lg w-fit" href='/hotels'>Hotel hinzufügen</a>
			<a className="bg-slate-600 px-4 py-2 rounded-lg w-fit" href='/trips'>Trip Buchen</a>
		</div>
	);
}