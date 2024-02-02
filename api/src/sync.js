module.exports = () => {
  const User = require("./models/User");
  const Car = require("./models/Car");
  const Trip = require("./models/Trip");
  const Location = require("./models/Location");
  const Segment = require("./models/Segment");
  const Request = require("./models/Request");
  const RequestSegments = require("./models/RequestSegment");

  User.hasOne(Car);
  Car.belongsTo(User, {
    allowNull: true,
  });
  Trip.belongsTo(User, {
    foreignKey: "driverId",
    as: "driver",
  });
  User.hasMany(Trip, {
    foreignKey: "driverId",
    allowNull: true,
    as: "driver",
  });
  Location.hasMany(Segment, {
    foreignKey: "startLocation",
    allowNull: true,
    as: "start",
  });
  Location.hasMany(Segment, {
    foreignKey: "endLocation",
    allowNull: true,
    as: "end",
  });
  Segment.belongsTo(Location, {
    foreignKey: "startLocation",
    as: "start",
  });
  Segment.belongsTo(Location, {
    foreignKey: "endLocation",
    as: "end",
  });
  Segment.belongsTo(Trip, {
    foreignKey: "tripId",
  });
  Trip.hasMany(Segment, {
    foreignKey: "tripId",
    as: "segments",
  });
  Request.belongsTo(User, {
    foreignKey: "userId",
    allowNull: false,
    as: "user",
  });
  Request.belongsTo(Trip, {
    foreignKey: "tripId",
    allowNull: false,
    as: "trip",
  });
  Request.belongsToMany(Segment, {
    through: RequestSegments,
  });
  Segment.belongsToMany(Request, {
    through: RequestSegments,
  });

  const syncDatabase = async () => {
    try {
      // await sequelize.sync({ force: true, alter: true });
      await User.sync();
      await Car.sync();
      await Trip.sync();
      await Location.sync();
      await Segment.sync();
      await Request.sync();
      await RequestSegments.sync();
      console.log("[DATABASE] - Synced database.");
    } catch (error) {
      console.error("[DATABASE] - Unable to sync database:", error);
    }
  };
  syncDatabase();
};
