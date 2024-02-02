const sequelize = require("../database");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
  "User",
  {
    // Model attributes are defined here
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    // Other model options go here
    freezeTableName: true,
  }
);

// User.sync({ force: true })
//   .then(() => {
//     console.log("Synced user entity.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync user entity: " + err.message);
//   });

// Car.sync({ force: true })
//   .then(() => {
//     console.log("Synced car entity.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync car entity: " + err.message);
//   });

module.exports = User;
