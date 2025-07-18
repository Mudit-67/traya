const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    password: { type: String, required:true }
  },
  { timestamps: true }
);

const User = mongoose.model('users', UserSchema);

module.exports = User;
