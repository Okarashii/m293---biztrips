const path = require('path');
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, '../db.json'))
const middlewares = jsonServer.defaults()
const validateSchema = require('./validateSchema');

const patchRoutes = {
	
}

const getRoutes = {
	"/airports/:iataCode": "/airports?iataCode=:iataCode",
	"/hotels": "/hotels",
	"/hotels/:hotelID": "/hotels/:hotelID",
	"/hotels/:hotelID/rooms": "/rooms?hotelID=:hotelID",
	"/trips/:tripID/meetings": "/meetings?tripID=:tripID",
	"/trips/:tripID/meetings/:meetingID": "/meetings/:meetingID",
	"/trips/:tripID/participants": "/participants?tripID=:tripID",
	"/trips/:tripID/participants/:participantID": "/participants/:participantID",
	"/trips/:tripID/participants/:participantID/planeTickets": "/planeTickets?participantID=:participantID",
	"/trips/:tripID/participants/:participantID/planeTickets/:planeTicketID": "/planeTickets/:planeTicketID",
	"/trips/:tripID/participants/:participantID/hotelBookings": "/hotelBookings?participantID=:participantID",
	"/trips/:tripID/participants/:participantID/hotelBookings/:hotelBookingID": "/hotelBookings/:hotelBookingID"
}

// Set default middlewares (logger, static, cors and no-cache)
// server.use(validateSchema)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)

// Use default router
server.use(router)
server.get(jsonServer.rewriter(getRoutes))
server.post(jsonServer.rewriter())

server.listen(3001, () => {
  console.log('JSON Server is running')
})