require('dotenv').config()
const { Sequelize, DataTypes } = require('sequelize')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const sequelize = new Sequelize('mydb', 'root', process.env.MYSQL_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
})

const UserSchema = sequelize.define(
  'User',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 15],
        notNull: {
          msg: 'Please provide name',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notNull: {
          msg: 'Please provide email',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 6,
        notNull: {
          msg: 'Please provide password',
        },
      },
    },
  },
  {
    timestamps: false,
  }
)

UserSchema.sync()

UserSchema.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
})

UserSchema.prototype.createJWT = function (){
  const payload = {
    userId: this.id,
    name: this.name
  }
  return jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

UserSchema.prototype.comparePassword = async function (candidatePassword){
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

module.exports = sequelize.model('User')
