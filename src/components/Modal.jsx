import { useState } from "react"

export default function Modal() {
	const [isOpen, setOpen] = useState(false);
	return {
		Modal: function({className, children}){
			return (
				<dialog open={isOpen} className={className}>
					{children}
				</dialog>
			)
		},
		setOpen
	}
}