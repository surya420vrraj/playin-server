const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    loginTime: { type: Date, default: Date.now },
    logoutTime: { type: Date },
    totalHours: { type: Object, default: { hours: 0, minutes: 0, seconds: 0 } },
    date: {
      type: Date,
      default: DateTime.now().setZone("Asia/Dubai").toJSDate(),
    },
    logout: {
      type: Boolean,
      default: false,
    },
    break: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "break",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

userActivitySchema.pre("save", function (next) {
  if (this.logout) {
    // Use DateTime to set the current time in Asia/Dubai timezone
    this.logoutTime = DateTime.now().setZone("Asia/Dubai").toJSDate();

    if (this.loginTime && this.logoutTime) {
      const loginTime = DateTime.fromJSDate(this.loginTime, {
        zone: "Asia/Dubai",
      });
      const logoutTime = DateTime.fromJSDate(this.logoutTime, {
        zone: "Asia/Dubai",
      });

      const totalDuration = logoutTime
        .diff(loginTime, ["hours", "minutes", "seconds"])
        .toObject();

      this.totalHours = {
        hours: totalDuration.hours,
        minutes: totalDuration.minutes,
        seconds: totalDuration.seconds,
      };
    }
  }

  next();
});
module.exports = mongoose.model("user_activity", userActivitySchema);
