var mongoose = require("mongoose");

var Card = mongoose.model("Card", {id: Number, filename: String});

module.exports.Card = Card;
