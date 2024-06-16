const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },
    passwordChangedAt: Date,
    passwrodResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,

    phone: String,
    profileImg: String,
    password: {
      type: String,
      required: [true, "Password required"],
      minlength: [6, "Too short password"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    addresses: [
      {
        id: { type: mongoose.Schema.ObjectId },
        alias: {
          type: String,
        },
        details: {
          type: String,
        },
        phone: {
          type: String,
        },
        postalCode: String,
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;
