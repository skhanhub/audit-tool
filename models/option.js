const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const optionSchema = new Schema({
  type: Object
});

const Option = mongoose.model("Option", optionSchema);

module.exports = Option;