const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  userType: {
    type: String,
    enum: ["patient", "doctor"],
  },
});

module.exports = User = mongoose.model("user", UserSchema);
