var mongoose = require("mongoose");
let Schema = mongoose.Schema;

var Card = mongoose.model("Card", {id: Number, filename: String});

module.exports.Card=Card;