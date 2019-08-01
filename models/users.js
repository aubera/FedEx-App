const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  role: {type: String, required: true},
  avatarPath: {type: String, required: true},
  classCode: {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);
