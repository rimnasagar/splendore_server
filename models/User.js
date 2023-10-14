var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");
const { USER_STATUS } = require("../constants");

// Define collection and schema for Items
var userSchema = new Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    display_name: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      require: [true, "Enter an email address."],
      unique: [true, "That email address is taken."],
      lowercase: true,
      validate: [validator.isEmail, "Enter a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Enter a password."],
      minLength: [4, "Password should be at least four characters"],
    },
    status: {
      type: String,
      default: USER_STATUS.PENDING
    },
    code: {
      type: String,
    },
    role: {
      type: String,
    },
    logs: {
      type: Array,
    },
    last_login: {
      type: Date,
      default: Date.now,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    deleted_at: {
      type: Date,
    },
  },
  {
    collection: "users",
  }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
