const mongoose = require("mongoose");
const ForgotSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);
// mongoose.models = {};
// export default mongoose.model("User", UserSchema);
export default mongoose.models.Forgot || mongoose.model("Forgot", ForgotSchema);
