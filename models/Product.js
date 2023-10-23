var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const validator = require("validator");
const { USER_STATUS } = require("../constants");

const productSchema = new Schema(
  {
    name: {
      type: String,
    },
    display_name: {
      type: String,
      default: ""
    },
    category:{
          type:String,
          default:""
    },
    status: {
      type: String,
      default: USER_STATUS.PENDING
    },
    code: {
      type: String,
    },
    selling_price: {
      type: String,
    },
    original_price: {
        type: String,
    },
    discount: {
        type: String,
    },
    display_image: {
        type: Schema.Types.ObjectId,
        ref: "Media",
        default: null,
    },
    images: [{ 
      type: Schema.Types.ObjectId,
      ref: "Media",
  }],
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
    collection: "products",
  }
);


module.exports = mongoose.model("Product", productSchema);
