const { Op } = require("sequelize");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const Trip = require("../models/Trip");
const User = require("../models/User");
const Location = require("../models/Location");
const Segment = require("../models/Segment");
const { validationResult } = require("express-validator");

// Create and Save a new Trips
exports.create = async (req, res) => {
  let { dbTrip, dbLocations, dbSegments } = [];

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Get the creator
  const token =
    req.header("Authorization") && req.header("Authorization").split(" ")[1];
  const driver = jwt.verify(token, process.env.JWT_SECRET).id;

  // Check if user has already a trip in the same date
  const userHasTripInSameDate = await Trip.findOne({
    where: {
      driverId: driver,
      startDate: {
        [Op.between]: [
          moment(req.body.startDate).startOf("day").toDate(),
          moment(req.body.startDate).endOf("day").toDate(),
        ],
      },
    },
  });

  if (userHasTripInSameDate) {
    return res
      .status(400)
      .json({ message: "User already has a trip at the same date" });
  }

  // Create a Trip
  const trip = {
    startDate: req.body.startDate,
    seats: req.body.seats,
    price: req.body.price,
    driverId: driver,
    estimatedDuration: req.body.estimatedDuration,
  };

  // Save Trip in the database
  try {
    dbTrip = await Trip.create(trip);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Trip.",
    });
  }

  // Sort steps by order
  const locations = req.body.steps
    .sort((a, b) => a.order - b.order)
    .map(({ name, address, longitude, latitude }) => ({
      name,
      address,
      longitude,
      latitude,
    }));

  // Create all Location from Req steps
  try {
    dbLocations = await Location.bulkCreate(locations);
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while creating Locations of the trip.",
    });
  }

  // Filter out the first location
  // segment = between 2 locations
  const newSegments = dbLocations.reduce((segments, step, index) => {
    if (index === 0) return segments;
    const price = getSegmentPrice(
      dbLocations[0],
      dbLocations[dbLocations.length - 1],
      dbLocations[index - 1],
      dbLocations[index],
      trip
    );

    let segment = {
      price: price,
      seatsAvailable: dbTrip.seats,
      startLocation: dbLocations[index - 1].id,
      endLocation: dbLocations[index].id,
      tripId: dbTrip.id,
    };

    segments.push(segment);
    return segments;
  }, []);

  // Create All Segments From Locations
  try {
    dbSegments = await Segment.bulkCreate(newSegments);
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while creating Segments of the trip.",
    });
  }

  res.send({ dbTrip, dbLocations, dbSegments });
};

// Retrieve all Trips from the database.
exports.findAll = (req, res) => {
  Trip.findAll({
    include: [
      {
        model: User,
        as: "driver",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: Segment,
        as: "segments",
        attributes: { exclude: ["startLocation", "endLocation", "tripId"] },
        include: [
          { model: Location, as: "start" },
          { model: Location, as: "end" },
        ],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Trips.",
      });
    });
};

exports.findAvailable = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      where: {
        state: "soon"
      },
      include: [
        {
          model: User,
          as: "driver",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Segment,
          as: "segments",
          attributes: { exclude: ["startLocation", "endLocation", "tripId"] },
          include: [
            { model: Location, as: "start" },
            { model: Location, as: "end" },
          ],
        },
      ],
    });

    res.send(trips);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving Trips.",
    });
  }
}

// Find a single Trip with an id
exports.findOne = (req, res) => {
  const tripId = req.params.id;

  Trip.findByPk(tripId, {
    include: [
      {
        model: Segment,
        as: "segments",
        attributes: { exclude: ["startLocation", "endLocation", "tripId"] },
        include: [
          { model: Location, as: "start" },
          { model: Location, as: "end" },
        ],
      },
    ],
  })
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Trip with id ${tripId} was not found.`,
        });
      }
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while retrieving trip with id ${tripId}.`,
      });
    });
};

// // Update a Tutorial by the id in the request
// exports.update = (req, res) => {};

// // Delete a Tutorial with the specified id in the request
// exports.delete = (req, res) => {};

// Find all published Trips/Segments by startLocation, endLocation and startDate
exports.search = async (req, res) => {
  // TODO : Check if available seats
  // TODO : return seatsAvailable

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { startLocation, endLocation, startDate } = req.body;

  let { startSegments, stopSegments, trips } = [];

  // Find Segments where startLocation are similar to req.
  try {
    startSegments = await Segment.findAll({
      where: {
        "$start.name$": {
          [Op.eq]: startLocation,
        },
      },
      include: [
        {
          model: Location,
          as: "start",
        },
        {
          model: Location,
          as: "end",
        },
      ],
      attributes: { exclude: ["startLocation", "endLocation"] },
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Trips.",
    });
  }

  // Find Segments where endLocation are similar to req.
  try {
    stopSegments = await Segment.findAll({
      where: {
        "$end.name$": {
          [Op.eq]: endLocation,
        },
      },
      include: [
        {
          model: Location,
          as: "start",
        },
        {
          model: Location,
          as: "end",
        },
      ],
      attributes: { exclude: ["startLocation", "endLocation"] },
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Trips.",
    });
  }

  // Find Trips where startDate are similar to req.
  try {
    trips = await Trip.findAll({
      attributes: { exclude: ["updatedAt", "driverId"] },
      where: {
        startDate: {
          [Op.gte]: moment(startDate).startOf("day").toDate(),
          [Op.lte]: moment(startDate).endOf("day").toDate(),
        },
      },
      include: [
        {
          model: User,
          as: "driver",
          attributes: { exclude: ["createdAt", "updatedAt", "password"] },
        },
        {
          model: Segment,
          as: "segments",
          attributes: { exclude: ["startLocation", "endLocation", "tripId"] },
          include: [
            { model: Location, as: "start" },
            { model: Location, as: "end" },
          ],
          order: [["id", "ASC"]],
        },
      ],
      order: [["startDate", "ASC"]],
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Trips.",
    });
  }

  const potentialTrips = trips.filter((trip) => {
    const startSegment = startSegments.find(
      (segment) => segment.id === trip.segments[0].id
    );
    const stopSegment = stopSegments.find(
      (segment) => segment.id === trip.segments[trip.segments.length - 1].id
    );
    return startSegment && stopSegment;
  });

  res.status(200).send(potentialTrips);
};

function getSegmentPrice(firstStart, lastEnd, segmentStart, segmentEnd, trip) {
    const totalDistance = getDistanceFromLatLonInKm(
      firstStart.longitude,
      firstStart.latitude,
      lastEnd.longitude,
      lastEnd.latitude
    );
    const segmentDistance = getDistanceFromLatLonInKm(
      segmentStart.longitude,
      segmentStart.latitude,
      segmentEnd.longitude,
      segmentEnd.latitude
    );
    return Math.round((segmentDistance * trip.price / totalDistance) * 100) / 100;
}

// Compute distance between two points on Earth given their latitudes and longitudes
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

// Convert degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
