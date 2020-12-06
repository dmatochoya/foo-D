const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  product: { type: String },
  type: { type: String },
});

module.exports = model('foodgroups', productSchema);