import { Outlet } from "react-router-dom"

export default function Layout() {
	return (
		<main className="flex w-screen h-screen">
			<aside className="flex flex-col gap-2 px-5 py-10 w-64 bg-slate-900 h-fit rounded-br-2xl">
				<a className="bg-slate-600 px-4 py-2 rounded-lg w-fit" href='/'>Hauptseite</a>
				<a className="bg-slate-600 px-4 py-2 rounded-lg w-fit" href='#airports/new'>Flughafen hinzufügen</a>
				<a className="bg-slate-600 px-4 py-2 rounded-lg w-fit" href='#flights/new'>Flug Hinzufügen</a>
				<a className="bg-slate-600 px-4 py-2 rounded-lg w-fit" href='#hotels/new'>Hotel hinzufügen</a>
				<a className="bg-slate-600 px-4 py-2 rounded-lg w-fit" href='#booktrip'>Trip Buchen</a>
			</aside>

			<div className="py-10 h-screen w-screen px-20">
				<Outlet/>
			</div>
		</main>
	)
}