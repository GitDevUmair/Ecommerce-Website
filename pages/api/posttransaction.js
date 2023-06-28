import Order from "@/models/Order";
import Product from "@/models/Product";
import connectDb from "@/middleware/mongoose";
const handler = async (req, res) => {
  try {
    let order = await Order.findOneAndUpdate(
      { orderId: req.body.oid },
      { status: "Paid" }
    );
    let products = order.products;
    for (let slug in products) {
      await Product.findOneAndUpdate(
        { slug: slug },
        { $inc: { availableQty: -products[slug].qty } }
      );
    }
    res.status(200).json({ success: true, id: order._id });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Payment confirmation failed" });
  }
};

export default connectDb(handler);
