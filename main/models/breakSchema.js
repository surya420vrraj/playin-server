const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "user", // Reference to the user who approved the break
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("break", breakSchema);
