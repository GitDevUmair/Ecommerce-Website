import User from "@/models/User";
import connectDb from "@/middleware/mongoose";
var jwt = require("jsonwebtoken");
const handler = async (req, res) => {
  if (req.method == "POST") {
    let token = req.body.token;
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findOne({ email: decoded.email });
    const { name, phone, pincode, address } = user;
    res.status(200).json({ name, phone, pincode, address });
  } else {
    res.status(400).json({ error: "error" });
  }
};
export default connectDb(handler);
