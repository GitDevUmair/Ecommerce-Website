import User from "@/models/User";
import connectDb from "@/middleware/mongoose";
var jwt = require("jsonwebtoken");
const handler = async (req, res) => {
  if (req.method == "POST") {
    let token = req.body.token;
    var user = jwt.verify(token, process.env.JWT_SECRET);
    await User.findOneAndUpdate(
      { email: user.email },
      {
        name: req.body.name,
        phone: req.body.phone,
        pincode: req.body.pincode,
        address: req.body.address,
      }
    );
    res.status(200).json({ success: true });
    return;
  } else {
    res.status(400).json({ error: "error" });
  }
};
export default connectDb(handler);
