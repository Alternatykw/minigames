const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  permissions: {
    type: String,
    required: false,
    default: "user"
  },
  balance: {
    type: mongoose.Schema.Types.Decimal128,
    required: false,
    default: 1000
  },
  profit: {
    type: mongoose.Schema.Types.Decimal128,
    required: false,
    default: 0
  },
  active: {
    type: Boolean,
    required: false,
    default: false
  },
  code: {
    type: String,
    required: false
  }
}, { versionKey: false });

const User = mongoose.model('User', userSchema);

module.exports = User;