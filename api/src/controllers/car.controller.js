const sequelize = require("../database");
const Car = require("../models/Car");
const User = require("../models/User");

// Create and Save a new Car
exports.create = async (req, res) => {
  const id = req.user.id;

  // Create a Car
  const car = {
    model: req.body.model,
    type: req.body.type,
    maxSeatAvailable: req.body.maxSeatAvailable,
    UserId: id,
  };

  Car.create(car)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the car.",
      });
    });
};

exports.findAll = (req, res) => {
  Car.findAll({ include: User })
    .then((data) => {
      let cars = [];
      data.forEach((car) => {
        let { UserId, ...carWithoutUserId } = car.dataValues;
        cars.push(carWithoutUserId);
      });
      res.send(cars);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving cars.",
      });
    });
}
