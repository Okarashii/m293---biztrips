const fs = require('fs');

module.exports = (req, res, next) => {
	if (req.originalUrl.startsWith("/airports?iataCode=")) {
		const iataCode = req.originalUrl.slice(-3);
		const db = JSON.parse(fs.readFileSync('./db.json'));
		const contents = db.airports.filter(ap => ap.iataCode === iataCode);
		if (contents.length !== 1) {
			res.status(404).jsonp();
		}
		else {
			res.jsonp(contents[0]);
		}
	}

	// next();
}