const Trip = require("../models/Trip");
const Location = require("../models/Location");
const Segment = require("../models/Segment");

// Retrieve a single segment from the database
exports.findOne = async (req, res) => {
  const segmentId = req.params.id;
  try {
    const segment = await Segment.findByPk(segmentId, {
      include: [
        { model: Location, as: "start" },
        { model: Location, as: "end" },
      ],
    });
    
    res.send(segment);
  } catch (error) {
    console.error("Can't fetch the segment: " + error);
    res.status(500).send({ message: "An error occurred" });
  }
};