import { useState, useEffect, useRef } from "react";
import { Form, useLocation } from "react-router-dom";

export default function FormModal(method="post", action) {
	const [isOpen, setOpen] = useState(false);
	const dialogRef = useRef(null);
	useEffect(() => {
		if (isOpen) {
			dialogRef.current.showModal();
		}
		else {
			dialogRef.current.close();
		}
	}, [isOpen])

	const location = useLocation();
	action = action ?? location.pathname;

	const handleSubmit = () => {
		console.log(method + " to ", action);
		setOpen(false);
	}

	return [
		function({className, children}) {
			return (
				<dialog ref={dialogRef} className="bg-transparent">
					<form className={className} action={action} method={method} navigate={false} onReset={() => setOpen(false)} onSubmit={handleSubmit}>
						{children}
					</form>
				</dialog>
			)
		},
		setOpen
	]
}