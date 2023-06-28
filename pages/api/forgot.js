var jwt = require("jsonwebtoken");
require("dotenv").config();
import Forgot from "@/models/Forgot";
import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
const nodemailer = require("nodemailer");
var CryptoJS = require("crypto-js");
("use strict");
const handler = async (req, res) => {
  if (req.body.sendMail) {
    var token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET);
    let forgot = new Forgot({
      email: req.body.email,
      token: token,
    });
    await forgot.save();
    console.log(req.body.email);
    let testAccount = await nodemailer.createTestAccount();
    let instructions = `We have received a request to reset the password for your account. If you did not make this request, please ignore this email.

        If you did request a password reset, please click on the following link to reset your password: 
        <a href='http://localhost:3000/forgot?token=${token}'></a> You will be taken to a page where you can enter a new password for your account.
        
        Please note that for security reasons, the password reset link will expire after 24 hours. If you are unable to reset your password within this timeframe, you will need to request another password reset.
        
        If you continue to have trouble resetting your password, please do not hesitate to contact us for further assistance.
        
        Best regards,
        Codeswear.com
        `;
    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    });
    let info = await transporter.sendMail({
      from: '"Umair 👻" <iumair350@gmail.com>', // sender address
      to: req.body.email, // list of receivers
      subject: "Email to recover your password", // Subject line
      text: instructions, // plain text body
      html: `<p>We have received a request to reset the password for your account. If you did not make this request, please ignore this email.

          If you did request a password reset, please click on the following link to reset your password: 
          <a href='http://localhost:3000/forgot?token=${token}'></a> You will be taken to a page where you can enter a new password for your account.
          
          Please note that for security reasons, the password reset link will expire after 24 hours. If you are unable to reset your password within this timeframe, you will need to request another password reset.
          
          If you continue to have trouble resetting your password, please do not hesitate to contact us for further assistance.
          
          Best regards,
          Codeswear.com
          </p>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
    if (info.messageId) {
      res.status(200).json({
        success: true,
        message: "An email has been sent to you to recover your password!",
      });
      return;
    } else {
      res.status(200).json({
        success: false,
        message: "Error sending email!",
      });
      return;
    }
    return;
  } else {
    let token = req.body.token;
    console.log(token);
    let forgot = await Forgot.findOne({ token: token });
    if (!forgot) {
      res.status(200).json({ success: false, message: "Invalid token" });
      return;
    } else {
      if (token === forgot.token) {
        var decoded = jwt.verify(token, process.env.JWT_SECRET);
        await User.findOneAndUpdate(
          { email: decoded.email },
          {
            password: CryptoJS.AES.encrypt(
              req.body.password,
              process.env.AES_SECRET
            ).toString(),
          }
        );
        res
          .status(200)
          .json({ success: true, message: "Your Password has been changed" });
        return;
      }
    }
  }
};
export default connectDb(handler);
