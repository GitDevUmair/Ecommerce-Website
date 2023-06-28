import User from "@/models/User";
import connectDb from "@/middleware/mongoose";
var jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");

const handler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(400).json({ error: "Invalid request method" });
    return;
  } else {
    let token = req.body.token;
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findOne({ email: decoded.email });
    let pass = CryptoJS.AES.decrypt(user.password, process.env.AES_SECRET);
    let decryptedPass = pass.toString(CryptoJS.enc.Utf8);
    console.log(decryptedPass);
    console.log(req.body.password);
    console.log(req.body.npassword);
    console.log(req.body.cpassword);
    if (
      decryptedPass === req.body.password &&
      req.body.npassword === req.body.cpassword
    ) {
      await User.findOneAndUpdate(
        { email: user.email },
        {
          password: CryptoJS.AES.encrypt(
            req.body.npassword,
            process.env.AES_SECRET
          ).toString(),
        }
      );
      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ success: false });
    }
  }
};
export default connectDb(handler);
