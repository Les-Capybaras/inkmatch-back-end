const sequelize = require("../database");
const { DataTypes } = require("sequelize");

const Location = sequelize.define(
  "Location",
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
  },
  {
    // Other model options go here
    freezeTableName: true,
    timestamps: false 
  }
);



module.exports = Location;
