const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../db.json');

const airportSchema = {
	required: {
		iataCode: "",
		name: "",
		country: "",
		city: ""
	},
	optional: {}
};

const flightSchema = {
	required: {
		departureAirportIATA: "",
		destinationAirportIATA: "",
		airline: "",
		economyPrice: 0,
		premiumEconomyPrice: 0,
		businessPrice: 0,
		firstClassPrice: 0
	},
	optional: {}
};

const hotelSchema = {
	required: {
		nearAirportIATA: "",
		name: "",
		address: "",
		city: "",
		contactFirstname: "",
		contactlastname: "",
		contactEmail: "",
	},
	optional: {
		img: "",
	}
};

const roomSchema = {
	required: {
		roomNr: "",
		hotelID: 0,
		capacity: 0,
		price: 0,
		isMeetingRoom: false
	},
	optional: {}
};

const meetingSchema = {
	required: {
		tripID: 0,
		hotelID: 0,
		meetingRoomNr: "",
		date: {
			required: {
				year: 0,
				month: 0,
				day: 0
			},
			optional: {}
		},
		startTime: {
			required: {
				hour: 0,
				minute: 0
			},
			optional: {}
		},
		endTime: {
			required: {
				hour: 0,
				minute: 0
			},
			optional: {}
		}
	},
	optional: {}
};

const participantSchema = {
	required: {
		tripID: 0,
		firstname: "",
		lastname: "",
		address: "",
		city: "",
		email: ""
	},
	optional: {}
};

const planeTicketSchema = {
	required: {
		tripID: 0,
		participantID: 0,
		flightID: 0,
		class: "",
		price: 0,
		departureDateTime: {
			required: {
				year: 0,
				month: 0,
				day: 0,
				hour: 0,
				minute: 0
			},
			optional: {}
		},
		arrivalDateTime: {
			required: {
				year: 0,
				month: 0,
				day: 0,
				hour: 0,
				minute: 0
			},
			optional: {}
		}
	},
	optional: {}
};

const hotelBookingSchema = {
	required: {
		hotelID: 0,
		participantID: 0,
		roomNr: "",
		price: 0,
		checkinDateTime: {
			required: {
				year: 0,
				month: 0,
				day: 0,
				hour: 0,
				minute: 0
			},
			optional: {}
		},
		checkoutDateTime: {
			required: {
				year: 0,
				month: 0,
				day: 0,
				hour: 0,
				minute: 0
			},
			optional: {}
		}
	},
	optional: {}
}

const tripSchema = {
	required: {
		startDate: {
			required: {
				year: 0,
				month: 0,
				day: 0
			},
			optional: {}
		},
		endDate: {
			required: {
				year: 0,
				month: 0,
				day: 0
			},
			optional: {}
		}
	},
	optional: {}
}

function hasValidProps(schema, obj, method) {
	return hasSameProperties(schema, obj, method)
}

function hasSameProperties({ required, optional }, obj, method) {
	return Object.keys(obj).every((prop) => {
		if (typeof obj[prop] !== 'object') {
			return (required.hasOwnProperty(prop) || optional.hasOwnProperty(prop)) && (method === "PATCH" || Object.keys(required).every((p) => obj.hasOwnProperty(p)));
		}
		else {
			return hasSameProperties(required[prop], obj[prop]) || hasSameProperties(optional[prop], obj[prop]);
		}
	})
}

function hasIdConflicts(resourceName, id, method) {
	const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
	if (method === "POST") {
		return db[resourceName].some(item => item.id == id);
	}

	return false;
}

module.exports = (req, res, next) => {
	const { body, method } = req;
	if (["POST", "PUT", "PATCH"].includes(method)) {
		const resourceName = req.path.substring(1).split('/')[0];
		const { id } = body;
		if (hasIdConflicts(resourceName, id)) {
			res.status(409).jsonp();
			return;
		}

		switch (resourceName) {
			default:
				res.status(400).jsonp();
				return;
			case "airports":
				if(!hasValidProps(airportSchema, body, method)) {
					res.status(400).jsonp();
					return;
				}

				// check for iataCode collisions
				if (method !== "PATCH") {
					const { airports } = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
					if (airports.some(({iataCode}) => iataCode === body.iataCode)) {
						res.status(409).jsonp();
						return;
					}
				}
				else if(body.iataCode !== undefined) {
					res.status(400).jsonp();
					return;
				}

				break;
			case "flights":
				if(!hasValidProps(flightSchema, body, method)) {
					res.status(400).jsonp();
					return;
				}

				break;
			case "hotels":
				if(!hasValidProps(hotelSchema, body, method)) {
					res.status(400).jsonp();
					return;
				}

				break;
			case "rooms":
				if(!hasValidProps(roomSchema, body, method)) {
					res.status(400).jsonp();
					return;
				}

				// Check for roomNr collisions
				if (method !== "PATCH") {
					const { rooms } = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
					if (rooms.some(({roomNr, hotelID}) => roomNr === body.roomNr && hotelID == body.hotelID)) {
						res.status(409).jsonp();
						return;
					}
				}
				else if (body.roomNr !== undefined) {
					res.status(400).jsonp();
					return;
				}

				// check for valid foreign keys
				if (method !== "PATCH") {
					if (body.hotelID === undefined) {
						res.status(400).jsonp();
						return;
					}

					const { hotels } = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
					const hotel = hotels.find(({id}) => body.hotelID == id);
					if (hotel === undefined) {
						res.status(400).jsonp();
						return;
					}
				}
				else {
					if (body.hotelID !== undefined) {
						res.status(400).jsonp();
						return;
					}
				}

				break;
			case "meetings":
				if(!hasValidProps(meetingSchema, body, method)) {
					res.status(400).jsonp();
					return;
				}

				// check for valid foreign keys
				if (method !== "PATCH") {
					if (body.tripID === undefined) {
						res.status(400).jsonp();
						return;
					}

					const { trips } = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
					const trip = trips.find(({id}) => body.tripID == id);
					if (trip === undefined) {
						res.status(400).jsonp();
						return;
					}
				}
				else {
					if (body.tripID !== undefined) {
						res.status(400).jsonp();
						return;
					}
				}
				break;
			case "participants":
				if(!hasValidProps(participantSchema, body, method)) {
					res.status(400).jsonp();
					return;
				}

				// check for valid foreign keys
				if (method !== "PATCH") {
					if (body.tripID === undefined) {
						res.status(400).jsonp();
						return;
					}

					const { trips } = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
					const trip = trips.find(({id}) => body.tripID == id);
					if (trip === undefined) {
						res.status(400).jsonp();
						return;
					}
				}
				else {
					if (body.tripID !== undefined) {
						res.status(400).jsonp();
						return;
					}
				}

				break;
			case "planeTickets":
				if(!hasValidProps(planeTicketSchema, body, method)) {
					res.status(400).jsonp();
					return;
				}

				// check for valid foreign keys
				if (method !== "PATCH") {
					if (body.participantID === undefined || body.tripID === undefined) {
						res.status(400).jsonp();
						return;
					}

					const { participants } = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
					const participant = participants.find(({id}) => body.participantID == id);
					if (participant === undefined || participant.tripID != body.tripID) {
						res.status(400).jsonp();
						return;
					}
				}
				else {
					if (body.participantID !== undefined || body.tripID !== undefined) {
						res.status(400).jsonp();
						return;
					}
				}

				break;
			case "hotelBooking":
				if(!hasValidProps(hotelBookingSchema, body, method)) {
					res.status(400).jsonp();
					return;
				}

				// check for valid foreign keys
				if (method !== "PATCH") {
					if (body.participantID === undefined || body.tripID === undefined) {
						res.status(400).jsonp();
						return;
					}

					const { participants } = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
					const participant = participants.find(({id}) => body.participantID == id);
					if (participant === undefined || participant.tripID != body.tripID) {
						res.status(400).jsonp();
						return;
					}
				}
				else {
					if (body.participantID !== undefined || body.tripID !== undefined) {
						res.status(400).jsonp();
						return;
					}
				}

				break;
			case "trips":
				if(!hasValidProps(tripSchema, body, method)) {
					res.status(400).jsonp();
					return;
				}
				break;
		}
	}

	console.log("validation completed");
	next();
}