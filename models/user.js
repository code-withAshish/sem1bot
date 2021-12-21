const mongoose = require("mongoose");

const user = mongoose.Schema({
  uname: {
    type: String,
    required: true,
  },
  uID: {
    type: Number,
    required: true,
  },
  msgID: {
    type: Number,
    required: true,
  },
  msg: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("user", user);
