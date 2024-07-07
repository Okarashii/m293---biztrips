const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'db.json');

const readDBObject = (object) => {
	const db = JSON.parse(fs.readFileSync('./db.json'));
	return db[object];
}

module.exports = (req, res, next) => {
	switch(req.method) {
		default: 
			next();
			break;
		case "POST":
			const { id } = req.body;
			const resourceName = req.path.substring(1);
			console.log(resourceName);
			if (id !== undefined) {
				if (isConflictingID(id, resourceName)) {
					res.status(409).jsonp();
					break;
				}

			}

			if (resourceName === "airports") {
				const { iataCode } = req.body;
				if (isConflictingIATACode(iataCode)) {
					res.status(409).jsonp();
					break;
				}
			}
			else if (resourceName === "rooms") {
				const { roomNr, hotelID } = req.body;
				if (isConflictingRoomNr(hotelID, roomNr)) {
					res.status(409).jsonp();
					break;
				}
			}

			next();

			break;
		case "GET":
			if (req.originalUrl.startsWith("/airports?iataCode=")) {
				const airports = readDBObject("airports");
				const iataCode = req.originalUrl.slice(-3);
				const contents = airports.filter(ap => ap.iataCode === iataCode);
				if (contents.length !== 1) {
					res.status(404).jsonp();
				}
				else {
					res.jsonp(contents[0]);
				}
			}
			else {
				next();
			}
			break;
	}
}

function isConflictingID(id, resourceName) {
	const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
	return db[resourceName] && db[resourceName].find(item => item.id == id);
}

function isConflictingIATACode(iataCode) {
	const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
	return db['airports'].find(item => item.iataCode === iataCode);
}

function isConflictingRoomNr(hotelID, roomNr) {
	console.log("HotelID", hotelID);
	console.log("roomNr", roomNr);
	const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
	return db['rooms'].find(item => item.roomNr === roomNr && item.hotelID == hotelID);
}