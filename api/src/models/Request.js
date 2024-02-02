const sequelize = require("../database");
const { DataTypes } = require("sequelize");
const User = require("./User");
const Trip = require("./Trip");

const Request = sequelize.define(
  "Request",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    tripId: {
      type: DataTypes.INTEGER,
      references: {
        model: Trip,
        key: "id",
      },
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      values: ['pending', 'accepted', 'rejected'],
      defaultValue: "pending",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Request;
