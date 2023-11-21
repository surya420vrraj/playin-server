const mongoose = require("mongoose");
const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    loginTime: { type: Date, default: Date.now },
    logoutTime: { type: Date },
    totalHours: { type: Object, default: { hours: 0, minutes: 0 } },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("user_activity", userActivitySchema);
