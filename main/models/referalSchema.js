const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const referalSchema = new Schema(
  {
    userName: {
      type: String,
      require: true,
    },
    referal: {
      type: String,
      require: true,
    },
    comments: {
      type: String,
      require: true,
    },
    executeName: {
      type: String,
      require: true,
    },
    Inboundphone: {
      type: String,
      require: true,
    },
    Internalwhatsapp: {
      type: Number,
      require: true,
    },
    externalwhatsapp: {
      type: Number,
      require: true,
    },
    date: {
      type: Date,
      require: true,
    },
    queryDate: {
      type: Date,
      require: true,
    },
    query: {
      type: String,
      require: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("referal", referalSchema);
