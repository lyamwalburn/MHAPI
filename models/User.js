const mongoose = require('mongoose')
const  bcrypt = require('bcrypt')
const UserSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  //Add array of recipie _id to track meals user has shopped for
  currentMeals: {
    type: Array,
    required: false,
  }
})

//methods
UserSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null)
}

//check password valid
UserSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password,this.password)
}

module.exports = mongoose.model('User', UserSchema)