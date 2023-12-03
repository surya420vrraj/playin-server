const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");
const breakSchema = new Schema(
  {
    breakType: {
      type: String,
      require: true,
    },
    reason: {
      type: String,
      require: true,
    },
    start: {
      type: String,
      require: true,
    },
    end: {
      type: String,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      default: "pending",
    },
    approved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "user", // Reference to the user who approved the break
    },
    breakDuration: {
      type: Object,
      default: { hours: 0, minutes: 0 },
    },
  },
  { timestamps: true }
);
// Mongoose middleware to calculate break duration before saving
breakSchema.pre("save", function (next) {
  if (this.start && this.end) {
    const breakStart = DateTime.fromFormat(this.start, "HH:mm", {
      zone: "Asia/Dubai",
    });
    const breakEnd = DateTime.fromFormat(this.end, "HH:mm", {
      zone: "Asia/Dubai",
    });

    const breakDuration = breakEnd.diff(breakStart, "minutes").toObject();
    this.breakDuration = {
      hours: Math.floor(breakDuration.minutes / 60),
      minutes: breakDuration.minutes % 60,
    };
  }

  next();
});
module.exports = mongoose.model("break", breakSchema);
