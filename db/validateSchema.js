const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../db.json');

const meetingSchema = {
	tripID: 0,
	hotelID: 0,
	meetingRoomNr: "",
	date: {
		year: 0,
		month: 0,
		day: 0
	},
	startTime: {
		hour: -1,
		minute: -1
	},
	endTime: {
		hour: -1,
		minute: -1
	}
}

const checkInteger = (integer, min=0, max=Infinity) => Number.parseInt(integer) === integer && integer >= min && integer <= max;
const checkFloat = (float) => !Number.isNaN(Number.parseFloat(float))
const checkString = (string) => string !== undefined && string !== "";
const checkIATACode = (iataCode) => checkString(iataCode) && iataCode.length === 3 && iataCode.toUppercase() === iataCode;
const checkDate = ({year, month, day}) => checkInteger(year, new Date().getFullYear()) && checkInteger(month, 1, 12) && checkInteger(day, 1, 31);
const checkTime = ({hour, minute}) => checkInteger(hour, 0, 23) && checkInteger(minute, 0, 59);

module.exports = (req, res, next) => {
	if (["POST", "PUT", "PATCH"].includes(req.method)) {
		const resourceName = req.path.substring(1).split('/')[0];
		const { id } = req.body;
		if (hasIdConflicts(resourceName, id)) {
			res.status(409).jsonp();
			return;
		}

		switch (resourceName) {
			default:
				res.status(400).jsonp();
				return;
			case "airports":
				const { name, iataCode, country, city } = req.body;
				if (!checkString(name) || !checkString(country) || !checkString(city) || !checkIATACode(iataCode)) {
					res.status(400).jsonp();
					return;
				}

				if (req.method === "POST") {
					const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
					if (db['airports'].find(item => item.iataCode === iataCode)) {
						res.status(409).jsonp();
						return;
					}
				}

				break;
			case "flights":
				const { departureAirportIATA, destinationAirportIATA, airline, economyPrice, premiumEconomyPrice, businessPrice, firstClassPrice } = req.body;
				if (!checkIATACode(departureAirportIATA) || !checkIATACode(destinationAirportIATA) || !checkString(airline) || !checkFloat(economyPrice) || !checkFloat(premiumEconomyPrice) || !checkFloat(businessPrice) || !checkFloat(firstClassPrice)) {
					res.status(400).jsonp();
					return;
				}
				break;
			case "hotels":
				const { nearAirportIATA, name: hotelName, address, city: hotelCity, contactFirstname, contactLastname, contactEmail } = req.body;
				if (!checkIATACode(nearAirportIATA) || !checkString(hotelName) || !checkString(hotelCity) || !checkString(address) || !checkString(contactFirstname) || !checkString(contactLastname) || !checkString(contactEmail)) {
					res.status(400).jsonp();
					return;
				}

				break;
			case "rooms":
				const { roomNr, hotelID, capacity, price, isMeetingRoom } = req.body;
				const queryHotelID = req.query.hotelID;

				console.log("req.body: ", req.body);
				console.log("req.query: ", req.query);
				if (!checkInteger(hotelID) || !checkString(roomNr) || !checkInteger(capacity) || !checkFloat(price) || isMeetingRoom === undefined || queryHotelID != hotelID) {
					res.status(400).jsonp();
					return;
				}
				break;
			case "meetings":
				const { tripID:meetingTripID, hotelID: meetingHotelID, meetingRoomNr, date, startTime, endTime } = req.body;
				console.log(req.body);
				if(req.method === "PATCH") {
					if (!hasSameProperties(meetingSchema, req.body)) {
						res.status(400).jsonp();
						return;
					}
				}
				else if (!hasAllSameProperties(meetingSchema, req.body)) {
					res.status(400).jsonp();
					return;
				}
				// else if (req.query.tripID != meetingTripID || !checkInteger(meetingTripID) || !checkInteger(meetingHotelID) || !checkString(meetingRoomNr) || !checkDate(date) || !checkTime(startTime) || !checkTime(endTime)) {
				// 	res.status(400).jsonp();
				// 	return;
				// }
				break;
			case "participants":
				const { tripID: participantTripID, firstname, lastname, address: participantAddress, city: participantCity, email } = req.body;
				if (!checkInteger(participantTripID) || !checkString(firstname) || !checkString(lastname) || !checkString(participantAddress) || !checkString(participantCity) || checkString(email) || req.query.tripID != participantTripID) {
					res.status(400).jsonp();
					return;
				}
				break;
		}
	}

	next();
}

function hasIdConflicts(resourceName, id) {
	console.log("resourceName: ", resourceName);
	const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
	return db[resourceName].find(item => item.id == id);
}

function hasSameProperties(schema, obj) {
	const hasSameProps = Object.keys(obj).every((prop) => {
		if (typeof obj[prop] !== 'object') {
			const result = schema.hasOwnProperty(prop);
			return result;
		}
		else {
			const result = hasSameProperties(schema[prop], obj[prop]);
			return result;
		}
	})

	return hasSameProps;
}

function hasAllSameProperties(schema, obj) {
	return Object.keys(schema).every((prop) => {
		if (typeof obj[prop] !== 'object') {
			return obj.hasOwnProperty(prop);
		}
		else {
			return obj.hasAllSameProperties(schema[prop], obj[prop]);
		}
	})
}