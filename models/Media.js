var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mediaSchema = new Schema(
  {
    name: {
      type: String,
    },
    actual_name: {
        type: String,
        default: null
    },
    type: {
      type: String,
    },
    size: {
      type: String,
    },
    mime_type: {
      type: String,
    },
    hash: {
      type: String,
    },
    extension: {
        type: String
    },
    url: {
        type: String
    },
    path: {
      type: String
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
    collection: "medias",
  }
);

mediaSchema.pre('remove', function(next) {
    //Address.remove({files: this._id}).exec();
    next();
});

module.exports = mongoose.model("Media", mediaSchema);
