import Order from "@/models/Order";
import Product from "@/models/Product";
import connectDb from "@/middleware/mongoose";
import Pincodes from "pincodes.json";

const handler = async (req, res) => {
  if (req.method === "POST") {
    let cart = req.body.cart;
    let isError = false;
    let product;
    let sumTotal = 0;
    for (let item in cart) {
      product = await Product.findOne({ slug: item });
      sumTotal += cart[item].qty * cart[item].price;
      if (product.availableQty < cart[item].qty) {
        res.status(200).json({
          success: false,
          error: "Some items in your cart went out of stock. Please try again!",
          cartClear: true,
        });
        return;
      }

      if (cart[item].price !== product.price) {
        isError = true;
        res.status(200).json({
          success: false,
          error:
            "The price of some items have changed in your cart. Please try again",
          cartClear: true,
        });
        return;
      }
    }
    if (!Object.keys(Pincodes).includes(req.body.pincode)) {
      res.status(200).json({
        success: false,
        error: "Your Entered Pincode is not Servicable!",
        cartClear: false,
      });
      return;
    }
    if (req.body.subTotal <= 0) {
      res.status(200).json({
        success: false,
        error: "Cart Empty! Please build your cart and try again!",
        cartClear: false,
      });
      return;
    }
    if (
      req.body.phone.length !== 10 ||
      !Number.isInteger(Number(req.body.phone))
    ) {
      res.status(200).json({
        success: false,
        error: "Please enter your valid 10 digit phone number!",
        cartClear: false,
      });
      return;
    }
    if (
      req.body.pincode.length !== 5 ||
      !Number.isInteger(Number(req.body.pincode))
    ) {
      res.status(200).json({
        success: false,
        error: "Please enter your valid 5 digit pincode!",
        cartClear: false,
      });
      return;
    }
    if (req.body.subTotal !== sumTotal) {
      isError = true;
      res.status(200).json({
        success: false,
        error:
          "The price of some items have changed in your cart. Please try again",
        cartClear: true,
      });
      return;
    }

    if (!isError) {
      let order = new Order({
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
        amount: req.body.subTotal,
      });
      await order.save();
      res.status(200).json({ success: true });
    }
  } else {
    res.status(400).json({ error: "This method is not supported" });
  }
};

export default connectDb(handler);
