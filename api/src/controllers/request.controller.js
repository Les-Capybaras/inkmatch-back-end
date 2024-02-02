const RequestSegments = require("../models/RequestSegment");
const Request = require("../models/Request");
const Trip = require("../models/Trip");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Segment = require("../models/Segment");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

exports.get = async (req, res) => {
  const token = req.header("Authorization") && req.header("Authorization").split(" ")[1];
  const userId = jwt.verify(token, process.env.JWT_SECRET).id;

  let requests = [];
  try {
    requests = await Request.findAll({
      where: {
        status: {
          [Op.eq]: "pending",
        },
      },
      include: [
        {
          model: Trip,
          as: "trip",
        },
      ],
    });
  }
  catch (err) {
    return res.status(500).send({
      message: err.message || `Some error occurred while retrieving requests.`,
    });
  }
  //Retrieve all requests where the user is the trip driver
  const driverRequests = requests.filter((request) => request.trip.driverId === userId);

  res.status(200).send(driverRequests);
};

exports.request = async (req, res) => {
  // TODO : Check if available seats
  // TODO : Check everything before creation

  const tripId = req.params.id;

  const { segmentIds } = req.body;

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Get the current user
  const token =
    req.header("Authorization") && req.header("Authorization").split(" ")[1];
  const driver = jwt.verify(token, process.env.JWT_SECRET).id;

  // Check if trip exists
  let trip = {};
  try {
    trip = await Trip.findByPk(tripId);
  } catch (err) {
    return res.status(500).send({
      message:
        err.message ||
        `Some error occurred while retrieving trip with id ${tripId}.`,
    });
  }

  // Check if seats are available by segment

  // Retreive booked segments requested by user
  // const requestedSegments = [];
  // try {
  //   requestedSegments = await RequestSegments.findAll({
  //     where: {
  //       id: {
  //         [Op.in]: segmentIds,
  //       },
  //     },
  //   });
  // } catch (error) {
  //   return res.status(500).send({
  //     message: err.message || `Some error occurred while retrieving segments.`,
  //   });
  // }

  // const seatsAvailable = segments.reduce((acc, segment) => {
  //   return acc && segment.seatsAvailable > 0;
  // }, true);

  // if (!seatsAvailable) {
  //   return res.status(400).send({
  //     message: `Not enough seats available.`,
  //   });
  // }

  // Check if user is the driver
  if (trip.driverId === driver) {
    return res.status(400).send({
      message: `You are the driver of this trip.`,
    });
  }

  let existingUserTrips = [];
  // Check if user is already in a trip
  try {
    existingUserTrips = await Request.findAll({
      where: {
        userId: driver,
      },
      include: [
        {
          model: Trip,
          as: "trip",
        },
      ],
    });

    if (existingUserTrips.length > 0) {
      const activeTrips = existingUserTrips.filter(
        (trip) => trip.status === "accepted"
      );
      if (activeTrips.length > 0) {
        return res.status(400).send({
          message: `You are already in a trip.`,
        });
      }
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message || `Some error occurred while retrieving request.`,
    });
  }

  // Create the request
  let request = {};
  try {
    request = await Request.create({
      userId: driver,
      tripId,
    });

    const requestSegments = await RequestSegments.bulkCreate(
      segmentIds.map((segmentId) => ({
        RequestId: request.id,
        SegmentId: segmentId,
      }))
    );
  } catch (err) {
    return res.status(500).send({
      message: err.message || `Some error occurred while creating request.`,
    });
  }

  // Send the request
  res.status(201).send(request);
};

exports.accept = async (req, res) => {
  // TODO : Mark Request as accepted
  // TODO : Remove a seat for each segment in the request

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Get the creator
  const token =
    req.header("Authorization") && req.header("Authorization").split(" ")[1];
  const driver = jwt.verify(token, process.env.JWT_SECRET).id;

  const requestId = req.params.id;

  // Check if request exists
  let request = {};
  try {
    request = await Request.findByPk(requestId);

    // Check if request is still pending
    if (request.status !== "pending") {
      return res.status(400).send({
        message: `Request is not available .`,
      });
    }
  } catch (err) {
    return res.status(500).send({
      message:
        err.message ||
        `Some error occurred while retrieving request with id ${requestId}.`,
    });
  }

  // Check if user is the driver
  let trip = {};
  try {
    trip = await Trip.findOne({
      where: {
        id: request.tripId,
      },
    });

    if (trip.driverId !== driver) {
      return res.status(400).send({
        message: `You are not the driver of this trip.`,
      });
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message || `Some error occurred while retrieving trip.`,
    });
  }

  // Edit the request status
  let updatedRequest = {};
  try {
    updatedRequest = await Request.update(
      {
        status: "accepted",
      },
      {
        where: {
          id: requestId,
        },
      }
    );
  } catch (err) {
    return res.status(500).send({
      message: err.message || `Some error occurred while updating request.`,
    });
  }

  // Get the segments of the request
  let requestSegments = [];
  try {
    requestSegments = await RequestSegments.findAll({
      where: {
        RequestId: requestId,
      },
    });
  } catch (err) {
    return res.status(500).send({
      message: err.message || `Some error occurred while retrieving segments.`,
    });
  }

  // Remove a seat for each segment in the request
  let updatedSegments = [];
  try {
    updatedSegments = await Promise.all(
      requestSegments.map((requestSegment) =>
        Segment.update(
          {
            seatsAvailable: Sequelize.literal("seatsAvailable - 1"),
          },
          {
            where: {
              id: requestSegment.SegmentId,
              seatsAvailable: { [Op.gt]: 0 },
            },
          }
        )
      )
    );
  } catch (err) {
    return res.status(500).send({
      message: err.message || `Some error occurred while updating segments.`,
    });
  }

  res.status(200).send(updatedSegments);
};

exports.reject = async (req, res) => {

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Get the creator
  const token =
    req.header("Authorization") && req.header("Authorization").split(" ")[1];
  const driver = jwt.verify(token, process.env.JWT_SECRET).id;

  const requestId = req.params.id;

  // Check if request exists
  let request = {};
  try {
    request = await Request.findByPk(requestId);

    // Check if request is still pending
    if (request.status !== "pending") {
      return res.status(400).send({
        message: `Request is not available.`,
      });
    }
  } catch (err) {
    return res.status(500).send({
      message:
        err.message ||
        `Some error occurred while retrieving request with id ${requestId}.`,
    });
  }

  // Check if user is the driver
  let trip = {};
  try {
    trip = await Trip.findOne({
      where: {
        id: request.tripId,
      },
    });

    if (trip.driverId !== driver) {
      return res.status(400).send({
        message: `You are not the driver of this trip.`,
      });
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message || `Some error occurred while retrieving trip.`,
    });
  }

  // Edit the request status
  let updatedRequest = {};
  try {
    updatedRequest = await Request.update(
      {
        status: "rejected",
      },
      {
        where: {
          id: requestId,
        },
      }
    );
  } catch (err) {
    return res.status(500).send({
      message: err.message || `Some error occurred while updating request.`,
    });
  }

  res.status(200).send({
    message: `Request with id ${requestId} has been rejected.`,
  });
};