"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var mongoose = require("mongoose");

var OrderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  products: {
    type: Object,
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  pincode: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  status: {
    type: String,
    "default": "",
    required: true
  },
  deliveryStatus: {
    type: String,
    "default": "unshipped"
  }
}, {
  timestamps: true
}); // mongoose.models = {};
// export default mongoose.model("Order", OrderSchema);

var _default = mongoose.models.Order || mongoose.model("Order", OrderSchema);

exports["default"] = _default;