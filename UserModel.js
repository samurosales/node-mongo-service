const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
   name: String, 
   location: String,
   age: Number,
   infected_type: String,
   state: String
})

module.exports = mongoose.model('patients',UserSchema)