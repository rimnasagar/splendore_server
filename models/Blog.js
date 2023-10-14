var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const validator = require("validator");
const { USER_STATUS } = require("../constants");

const blogSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
      default: ""
    },
    link: {
      type: String,
      default: USER_STATUS.PENDING
    },
    
  
  },
  {
    collection: "blogs",
  }
);


module.exports = mongoose.model("Blog", blogSchema);
