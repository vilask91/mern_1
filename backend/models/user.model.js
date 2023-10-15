const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
       type: String,
       required: true
    },
    dob: {
       type: Date
    },
    gender: {
       type: String,
       enum: ['Male', 'Female', 'Other'],
    },
    role: {
       type: String,
       enum: ['Admin', 'User'],
       default: 'User'
    }
   }, {
   timestamps: true
  });
  module.exports = mongoose.model('User', userSchema);
  // export  User as module