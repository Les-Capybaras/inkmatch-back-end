import { Sequelize } from 'sequelize'

// Database connection
const user = process.env.MARIADB_USER
const pwd = process.env.MARIADB_PASSWORD
const db = process.env.MARIADB_DATABASE

if (!user || !pwd || !db) {
  console.error('[DATABASE] - Missing environment variables')
  process.exit(1)
}

let sequelize: Sequelize

if (process.env.NODE_ENV === 'ci') {
  // Use Pipeline service
  sequelize = new Sequelize(db, user, pwd, {
    host: '127.0.0.1',
    dialect: 'mariadb',
    port: 3306,
    username: 'root',
    password: 'ChangeMe!',
    database: 'changeme',
    protocol: 'tcp',
    logging: false,
  })
} else {
  sequelize = new Sequelize(db, user, pwd, {
    // Use Docker service
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

export default sequelize
