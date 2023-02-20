const mongoose = require('mongoose')

const URL = process.env.MONGODB_URI
mongoose.set('strictQuery', false)

mongoose.connect(URL).then(result => {
  console.log('connected to MongoDB');
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (doc, retObj) => {
    retObj.id = doc._id.toString()
    delete retObj._id
    delete retObj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)