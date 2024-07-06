const fs = require('fs');
const path = require('path');

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
			const { id, iataCode } = req.body;
			console.log(iataCode);
			if (id !== undefined || iataCode !== undefined) {
				const dbPath = path.resolve(__dirname, 'db.json');
				const resourceName = req.path.substring(1);
				const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

				const existingEntry = db[resourceName] && db[resourceName].find(item => item.id == id || (item.iataCode !== undefined && item.iataCode === iataCode));
				
				if (existingEntry) {
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