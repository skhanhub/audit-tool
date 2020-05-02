const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configSchema = new Schema({
  serverType: { type: String, required: true },
  subCategory: { type: String, required: true },
  hostName: { type: String, required: true },
  env: { type: String, required: true },
  time: { type: Number, required: true },
  config: { type: Object, required: true },
  master: { type: Boolean, required: true },

});

const Config = mongoose.model("configs", configSchema);

module.exports = Config;
