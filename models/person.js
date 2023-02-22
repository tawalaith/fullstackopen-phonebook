const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
const URL = process.env.MONGODB_URI
mongoose.set('strictQuery', false)

mongoose.connect(URL).then(() => {
  console.log('connected to MongoDB')
})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 8,
    validate: (number) => /^[0-9]{2,3}-[0-9]+/.test(number)
  }
})

personSchema.set('toJSON', {
  transform: (doc, retObj) => {
    retObj.id = doc._id.toString()
    delete retObj._id
    delete retObj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)