"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Forgot = _interopRequireDefault(require("@/models/Forgot"));

var _mongoose = _interopRequireDefault(require("@/middleware/mongoose"));

var _User = _interopRequireDefault(require("@/models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var jwt = require("jsonwebtoken");

require("dotenv").config();

var nodemailer = require("nodemailer");

var CryptoJS = require("crypto-js");

"use strict";

var handler = function handler(req, res) {
  var token, forgot, testAccount, instructions, transporter, info, _token, _forgot, decoded;

  return regeneratorRuntime.async(function handler$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!req.body.sendMail) {
            _context.next = 27;
            break;
          }

          token = jwt.sign({
            email: req.body.email
          }, process.env.JWT_SECRET);
          forgot = new _Forgot["default"]({
            email: req.body.email,
            token: token
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(forgot.save());

        case 5:
          console.log(req.body.email);
          _context.next = 8;
          return regeneratorRuntime.awrap(nodemailer.createTestAccount());

        case 8:
          testAccount = _context.sent;
          instructions = "We have received a request to reset the password for your account. If you did not make this request, please ignore this email.\n\n        If you did request a password reset, please click on the following link to reset your password: \n        <a href='http://localhost:3000/forgot?token=".concat(token, "'></a> You will be taken to a page where you can enter a new password for your account.\n        \n        Please note that for security reasons, the password reset link will expire after 24 hours. If you are unable to reset your password within this timeframe, you will need to request another password reset.\n        \n        If you continue to have trouble resetting your password, please do not hesitate to contact us for further assistance.\n        \n        Best regards,\n        Codeswear.com\n        ");
          _context.next = 12;
          return regeneratorRuntime.awrap(nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL_USERNAME,
              // generated ethereal user
              pass: process.env.EMAIL_PASSWORD // generated ethereal password

            }
          }));

        case 12:
          transporter = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: '"Umair 👻" <iumair350@gmail.com>',
            // sender address
            to: req.body.email,
            // list of receivers
            subject: "Email to recover your password",
            // Subject line
            text: instructions,
            // plain text body
            html: "<p>We have received a request to reset the password for your account. If you did not make this request, please ignore this email.\n\n          If you did request a password reset, please click on the following link to reset your password: \n          <a href='http://localhost:3000/forgot?token=".concat(token, "'></a> You will be taken to a page where you can enter a new password for your account.\n          \n          Please note that for security reasons, the password reset link will expire after 24 hours. If you are unable to reset your password within this timeframe, you will need to request another password reset.\n          \n          If you continue to have trouble resetting your password, please do not hesitate to contact us for further assistance.\n          \n          Best regards,\n          Codeswear.com\n          </p>") // html body

          }));

        case 15:
          info = _context.sent;
          console.log("Message sent: %s", info.messageId);

          if (!info.messageId) {
            _context.next = 22;
            break;
          }

          res.status(200).json({
            success: true,
            message: "An email has been sent to you to recover your password!"
          });
          return _context.abrupt("return");

        case 22:
          res.status(200).json({
            success: false,
            message: "Error sending email!"
          });
          return _context.abrupt("return");

        case 24:
          return _context.abrupt("return");

        case 27:
          _token = req.body.token;
          console.log(_token);
          _context.next = 31;
          return regeneratorRuntime.awrap(_Forgot["default"].findOne({
            token: _token
          }));

        case 31:
          _forgot = _context.sent;

          if (_forgot) {
            _context.next = 37;
            break;
          }

          res.status(200).json({
            success: false,
            message: "Invalid token"
          });
          return _context.abrupt("return");

        case 37:
          if (!(_token === _forgot.token)) {
            _context.next = 43;
            break;
          }

          decoded = jwt.verify(_token, process.env.JWT_SECRET);
          _context.next = 41;
          return regeneratorRuntime.awrap(_User["default"].findOneAndUpdate({
            email: decoded.email
          }, {
            password: CryptoJS.AES.encrypt(req.body.password, process.env.AES_SECRET).toString()
          }));

        case 41:
          res.status(200).json({
            success: true,
            message: "Your Password has been changed"
          });
          return _context.abrupt("return");

        case 43:
        case "end":
          return _context.stop();
      }
    }
  });
};

var _default = (0, _mongoose["default"])(handler);

exports["default"] = _default;