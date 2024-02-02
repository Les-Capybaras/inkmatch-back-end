const { DataTypes } = require('sequelize');
const User = require('./User');
const sequelize = require('../database')

const Trip = sequelize.define('Trip', {
    state: {
        type: DataTypes.ENUM,
        values: ['soon', 'pending', 'finished'],
        allowNull: false,
        defaultValue: 'soon'
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    seats: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price : {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    estimatedDuration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    driverId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
    }, {
        freezeTableName: true
    });

module.exports = Trip;

