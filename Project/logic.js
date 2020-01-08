var schemas = require("./schemas");

var cardsPlayedNo= 0
var cards =    ["2","2","2","2",
                "3","3","3","3",
                "4","4","4","4",
                "5","5","5","5",
                "6","6","6","6",
                "7","7","7","7",
                "8","8","8","8",
                "9","9","9","9",
                "10","10","10","10",
                "11","11","11","11",
                "12","12","12","12",
                "13","13","13","13",
                "14","14","14","14"
             ]

var img =   ["1","2","3","4"
            ,"5","6","7","8"
            ,"9","10","11","12"
            ,"13","14","15","16"
            ,"17","18","19","20"
            ,"21","22","23","24"
            ,"25","26","27","28"
            ,"29","30","31","32"
            ,"33","34","35","36"
            ,"37","38","39","40"
            ,"41","42","43","44"
            ,"45","46","47","48"
            ,"49","50","51","52"]

function shuffle(array) {
    var i = array.length,
    j = 0,
    temp;
    


    while (i--) {

        j = Math.floor(Math.random() * (i+1));

        // swap randomly chosen element with current element
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;

        temp = img[i];
        img[i] = img[j];
        img[j] = temp;
        
}

return array;}

function NextCard(){
    playedCards[cardsPlayedNo]= currentCard;
    playedImgs[cardsPlayedNo] = currentImg;
    currentCard= deck[deck.length-1];
    currentImg = img[img.length-1];
    deckPos++;
    deck.pop();
    img.pop();   
    console.log(deckPos)
    
}

function NewGame(){
    deck = [];     
    deck = shuffle(cards);
    currentCard= deck[deck.length-1];
    currentImg = img[img.length-1];
    deck.pop();
    img.pop();
    playedCards = [];
    playedImgs = [];
    cardsPlayedNo= 0
    deckPos=1;
    nextGo= false;
    guessNumber=1;
    incorrectGuesses=0;
    gameOver=false;

 }

 module.exports.NewGame= NewGame;
module.exports.NextCard = NextCard;
module.exports.shuffle= shuffle;