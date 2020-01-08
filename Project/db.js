var schemas = require("./schemas");

async function getCard(id) {
    return await schemas.Card.findOne({"id": id});
}

module.exports.getCard = getCard;