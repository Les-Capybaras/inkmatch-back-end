const { DataTypes } = require('sequelize');
const sequelize = require("../database");

const Media = sequelize.define('Media', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        originalname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        path: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        mimetype: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
    }
);

module.exports = Media;