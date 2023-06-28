"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Order = _interopRequireDefault(require("@/models/Order"));

var _Product = _interopRequireDefault(require("@/models/Product"));

var _mongoose = _interopRequireDefault(require("@/middleware/mongoose"));

var _pincodes = _interopRequireDefault(require("pincodes.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var handler = function handler(req, res) {
  var cart, isError, product, sumTotal, item, order;
  return regeneratorRuntime.async(function handler$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(req.method === "POST")) {
            _context.next = 43;
            break;
          }

          cart = req.body.cart;
          isError = false;
          sumTotal = 0;
          _context.t0 = regeneratorRuntime.keys(cart);

        case 5:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 20;
            break;
          }

          item = _context.t1.value;
          _context.next = 9;
          return regeneratorRuntime.awrap(_Product["default"].findOne({
            slug: item
          }));

        case 9:
          product = _context.sent;
          sumTotal += cart[item].qty * cart[item].price;

          if (!(product.availableQty < cart[item].qty)) {
            _context.next = 14;
            break;
          }

          res.status(200).json({
            success: false,
            error: "Some items in your cart went out of stock. Please try again!",
            cartClear: true
          });
          return _context.abrupt("return");

        case 14:
          if (!(cart[item].price !== product.price)) {
            _context.next = 18;
            break;
          }

          isError = true;
          res.status(200).json({
            success: false,
            error: "The price of some items have changed in your cart. Please try again",
            cartClear: true
          });
          return _context.abrupt("return");

        case 18:
          _context.next = 5;
          break;

        case 20:
          if (Object.keys(_pincodes["default"]).includes(req.body.pincode)) {
            _context.next = 23;
            break;
          }

          res.status(200).json({
            success: false,
            error: "Your Entered Pincode is not Servicable!",
            cartClear: false
          });
          return _context.abrupt("return");

        case 23:
          if (!(req.body.subTotal <= 0)) {
            _context.next = 26;
            break;
          }

          res.status(200).json({
            success: false,
            error: "Cart Empty! Please build your cart and try again!",
            cartClear: false
          });
          return _context.abrupt("return");

        case 26:
          if (!(req.body.phone.length !== 10 || !Number.isInteger(Number(req.body.phone)))) {
            _context.next = 29;
            break;
          }

          res.status(200).json({
            success: false,
            error: "Please enter your valid 10 digit phone number!",
            cartClear: false
          });
          return _context.abrupt("return");

        case 29:
          if (!(req.body.pincode.length !== 5 || !Number.isInteger(Number(req.body.pincode)))) {
            _context.next = 32;
            break;
          }

          res.status(200).json({
            success: false,
            error: "Please enter your valid 5 digit pincode!",
            cartClear: false
          });
          return _context.abrupt("return");

        case 32:
          if (!(req.body.subTotal !== sumTotal)) {
            _context.next = 36;
            break;
          }

          isError = true;
          res.status(200).json({
            success: false,
            error: "The price of some items have changed in your cart. Please try again",
            cartClear: true
          });
          return _context.abrupt("return");

        case 36:
          if (isError) {
            _context.next = 41;
            break;
          }

          order = new _Order["default"]({
            email: req.body.email,
            orderId: req.body.oid,
            address: req.body.address,
            phone: req.body.phone,
            name: req.body.name,
            pincode: req.body.pincode,
            city: req.body.city,
            province: req.body.province,
            status: "Pending",
            products: req.body.cart,
            amount: req.body.subTotal
          });
          _context.next = 40;
          return regeneratorRuntime.awrap(order.save());

        case 40:
          res.status(200).json({
            success: true
          });

        case 41:
          _context.next = 44;
          break;

        case 43:
          res.status(400).json({
            error: "This method is not supported"
          });

        case 44:
        case "end":
          return _context.stop();
      }
    }
  });
};

var _default = (0, _mongoose["default"])(handler);

exports["default"] = _default;