/**
 * @swagger
 * tags:
 *  name: Cars
 *  description: Car management
 * /cars:
 *   get:
 *     tags: [Cars]
 *     summary: Retrieve all cars.
 *     description: Retrieve all cars from database.
 *   post:
 *     tags: [Cars]
 *     summary: Create a car.
 *     description: Create a car in database.
 */

module.exports = app => {
    const cars = require("../controllers/car.controller.js");

    const { isAuth } = require("../middlewares/auth");
  
    var router = require("express").Router();

    // Create a new Car
    router.post("/", isAuth, cars.create);

    // Retrieve all Cars
    router.get("/", isAuth, cars.findAll);

    app.use('/api/car', router);
  };