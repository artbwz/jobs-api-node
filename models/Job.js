require('dotenv').config()
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('mydb', 'root', process.env.MYSQL_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
})

const JobSchema = sequelize.define(
  'Job',
  {
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 50,
        notNull: {
          msg: 'Please provide company name',
        },
      },
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 100,
        notNull: {
          msg: 'Please provide position',
        },
      },
    },
    status: {
      type: DataTypes.ENUM,
      values: ['interview', 'declined', 'pending'],
      defaultValue: 'pending',
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide user',
        },
      },
    },
  },
  {
    timestamps: true,
  }
)



JobSchema.sync()

module.exports = sequelize.model('Job')
