// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String, 
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
});

module.exports = mongoose.model('User', userSchema);