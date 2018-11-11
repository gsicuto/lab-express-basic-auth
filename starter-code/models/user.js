const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_name: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
