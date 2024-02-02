const { checkSchema } = require('express-validator');
const { tripSchema, searchSchema } = require('../schemas/trip-schema');

/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       required:
 *         - startDate
 *         - seats
 *         - price
 *         - steps
 *       example:
 *         dbTrip: {
 *           state: "soon",
 *           id: 1,
 *           startDate: "2023-12-17T12:24:03.000Z",
 *           seats: 4,
 *           price: 13,
 *           driverId: 1,
 *           driver: {
  *            id: 1,
  *            firstname: "John",
  *            lastname: "John",
  *            email: "john@doe.com",
  *          },
 *           createdAt: "2021-04-09T12:24:03.000Z",  
 *           updatedAt: "2021-04-09T12:24:03.000Z",  
 *         }
 *         dbLocations: [
 *           {
 *             id: 1,
 *             name: "Paris",
 *             address: "11 impasse de la gare",
 *             longitude: 1.34555,
 *             latitude: 5.5,
 *           }
 *         ]
 *         dbSegments: [
 *           {
 *             id: 1,
 *             price: 4.67,
 *             seatsAvailable: 4,
 *             startLocation: 1,
 *             endLocation: 2,
 *             tripId: 1
 *           }
 *         ]
 *     
 */

/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: Trip management
 * /trips/search:
 *   post:
 *     tags: [Trips]
 *     summary: Search for a trip.
 *     description: Search for a trip in database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startLocation:
 *                 type: string
 *               endLocation:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *           example:
 *             startLocation: "Paris"
 *             endLocation: "Lyon"
 *             startDate: "2021-04-09 12:30:00"
 *     responses:
 *       200:
 *         description: Trips that corresponds to the search parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *       500:
 *         description: Server error
 * /trips/{id}:
 *   get:
 *     tags: [Trips]
 *     summary: Retrieve a trip.
 *     description: Retrieve a trip from database.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Trip id.
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: The created Trip.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       500:
 *         description: Server error
 * /trips:
 *   get:
 *     tags: [Trips]
 *     summary: Retrieve all trips.
 *     description: Retrieve all trips from database.
 *     responses:
 *       200:
 *         description: All of the trips.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *   post:
 *     tags: [Trips]
 *     summary: Create a trip.
 *     description: Create a trip in database.
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: The created Trip.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       500:
 *         description: Server error
 * /available:
 *   get:
 *     tags: [Trips]
 *     summary: Retrieve available trips.
 *     description: Retrieve all available trips from database.
 */

module.exports = app => {
    const trips = require("../controllers/trip.controller.js");

    const { isAuth } = require("../middlewares/auth.js");
  
    var router = require("express").Router();
  
    // Create a new Trip
    router.post("/", isAuth, checkSchema(tripSchema), trips.create);
  
    // Retrieve all Trip
    router.get("/", trips.findAll);

    // Retreive available trips
    router.get("/available", trips.findAvailable);
  
    // Retrieve a single Trip with id
    router.get("/:id", trips.findOne);
  
    // Update a Trip with id
    // router.put("/:id", trips.update);
  
    // Delete a Trip with id
    // router.delete("/:id", trips.delete);

    // Retreive a trip with start location, end location and date
    router.post("/search", checkSchema(searchSchema), trips.search);

    app.use('/api/trips', router);
  };