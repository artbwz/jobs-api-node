require('dotenv').config()
const Sequelize = require('sequelize')

const connectDB = new Sequelize('mydb', 'root', process.env.MYSQL_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
})
module.exports = connectDB