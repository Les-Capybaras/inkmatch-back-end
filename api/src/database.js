const { Sequelize } = require('sequelize')

// Database connection
const user = process.env.MARIADB_USER
const pwd = process.env.MARIADB_PASSWORD
const db = process.env.MARIADB_DATABASE

let sequelize

if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize(db, user, pwd, {
    host: '127.0.0.1', // Docker Service Name
    dialect: 'mariadb',
    logging: false, // Remove if SQL logs are wanted
    protocol: 'tcp',
    port: 3306,
  })
} else {
  sequelize = new Sequelize(db, user, pwd, {
    host: 'database', // Docker Service Name
    dialect: 'mariadb',
    logging: false, // Remove if SQL logs are wanted
  })
}

// Test connection to database
async function testAuthenticate() {
  try {
    await sequelize.authenticate()
    console.log('[DATABASE] - Connection has been established successfully.')
  } catch (error) {
    console.error('[DATABASE] - Unable to connect to the database', error)
  }
}

testAuthenticate()

module.exports = sequelize
