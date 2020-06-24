const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configSchema = new Schema({
  serverType: { type: String, required: true, index: true },
  subCategory: { type: String, required: true, index: true },
  hostName: { type: String, required: true, index: true },
  env: { type: String, required: true, index: true },
  time: { type: Number, required: true, index: true },
  config: { type: Object, required: true },
  rawConfig: { type: String, required: true },
  master: { type: Boolean, required: true, index: true },

});
configSchema.index({"rawConfig": "text"});
const Config = mongoose.model("configs", configSchema);

module.exports = Config;
