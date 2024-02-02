const sequelize = require("../database");
const { DataTypes } = require("sequelize");
const Request = require("./Request");
const Segment = require("./Segment");


const RequestSegments = sequelize.define(
  'RequestSegments',
  {
    RequestId: {
      type: DataTypes.INTEGER,
      references: {
        model: Request, 
        key: 'id'
      }
    },
    SegmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: Segment,
        key: 'id'
      }
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = RequestSegments;
