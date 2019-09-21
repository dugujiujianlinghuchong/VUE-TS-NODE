const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users"
  },
  name: {
    type: String,
    required: true,
    max: 40
  },
  imgID: {
    type: String,
    required: true
  },
  uploadTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  collectors: {
    type: Array,
    required: true,
    default: []
  }
})

module.exports = Images = mongoose.model("images", ImageSchema);