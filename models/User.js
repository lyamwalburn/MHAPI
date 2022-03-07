const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  microsoftId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  //Add array of recipie _id to track meals user has shopped for
  currentMeals: {
    type: Array,
    required: false,
  }
})

module.exports = mongoose.model('User', UserSchema)