const mongoose = require("mongoose");

const modifyOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "",
    },
    oderNum: {
      type: String,
      default: "",
    },
    firstname: {
      type: String,
      default: "",
    },
    lastname: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "",
    },

    timeToModify: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const ModifyOrder = mongoose.model("modifyOrder", modifyOrderSchema);
module.exports = ModifyOrder;
