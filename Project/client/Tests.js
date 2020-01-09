suite("Tests", function() {
    test("Table should have no images in when loaded", function() {
        chai.assert($(cardsPlayed).length, 0, "No table on page");
        chai.assert.equal($(cardsPlayed.length),[0], "TABLE", "'main' class element has the wrong type");
    });
});