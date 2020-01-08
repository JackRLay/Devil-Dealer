var mongoose = require("mongoose");
var schemas = require("./schemas");
var uri = "mongodb+srv://dbUser:dbUser@devildealer-kzeuz.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true});
for (i=1; i<54; i++) {
var card = new schemas.Card({"id": i,
"filename": i.toString() + ".png"});
card.save();
}
