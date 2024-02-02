/**
 * @swagger
 * tags:
 *  name: Segments
 *  description: Segment management
 * /segments:
 *   get:
 *     tags: [Segments]
 *     summary: Retrieve all segments.
 *     description: Retrieve all segments from database.
 *   post:
 *     tags: [Segments]
 *     summary: Create a segment.
 *     description: Create a segment in database.
 */

module.exports = app => {
    const segment = require("../controllers/segment.controller.js");

    const { isAuth } = require("../middlewares/auth.js");
  
    var router = require("express").Router();

    // Retrieve all Segments
    router.get("/:id", isAuth, segment.findOne);

    app.use('/api/segments', router);
  };