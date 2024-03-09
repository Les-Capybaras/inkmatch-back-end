import sequelize from '../database'
import { DataTypes } from 'sequelize'

const User = sequelize.define(
  'User',
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
    freezeTableName: true,
  }
)

export default User
