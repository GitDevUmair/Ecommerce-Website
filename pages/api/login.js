import User from "@/models/User";
import connectDb from "@/middleware/mongoose";
var jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");

const handler = async (req, res) => {
  if (req.method == "POST") {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      let pass = CryptoJS.AES.decrypt(user.password, process.env.AES_SECRET);
      let decryptedPass = pass.toString(CryptoJS.enc.Utf8);
      if (
        user.email === req.body.email &&
        req.body.password === decryptedPass
      ) {
        var token = jwt.sign(
          { name: user.name, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "2d",
          }
        );
        res.status(200).json({ success: true, token, email: user.email });
      } else {
        res.status(400).json({ success: false, error: "Invalid Credentials!" });
      }
    } else {
      res.status(400).json({ success: false, error: "No user found" });
    }
  }
};

export default connectDb(handler);
