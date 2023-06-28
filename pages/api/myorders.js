import Order from "@/models/Order";
import connectDb from "@/middleware/mongoose";
var jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  try {
    let token = req.body.token;
    let data = jwt.verify(token, process.env.JWT_SECRET);
    let orders = await Order.find({ email: data.email });
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default connectDb(handler);
