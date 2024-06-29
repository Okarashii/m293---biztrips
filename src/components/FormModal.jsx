import { useState } from "react";
import { Form, useLocation } from "react-router-dom";

export default function FormModal(method="post", action) {
	const [isOpen, setOpen] = useState(false);
	const location = useLocation();
	action = action ?? location.pathname;

	const handleSubmit = () => {
		console.log(method + " to ", action);
		setOpen(false);
	}

	return [
		function({className, children}) {
			return (
				<dialog open={isOpen}>
					<Form className={className} action={action} method={method} navigate={false} onReset={() => setOpen(false)} onSubmit={handleSubmit}>
						{children}
					</Form>
				</dialog>
			)
		},
		setOpen
	]
}