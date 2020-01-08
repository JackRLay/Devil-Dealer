var express = require("express");
var app = express();
var mongoose = require("mongoose");
var db = require("./db");
var logic = require("./logic");

var serv = require('http').Server(app);

var uri = "mongodb+srv://dbUser:dbUser@devildealer-kzeuz.mongodb.net/test?retryWrites=true&w=majority"; 



app.use(express.static("resources"));



app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});


app.use('/client',express.static(__dirname + '/client'));

app.get("/card/:id", function(request, response) {
    db.getCard(request.params.id).then(function(card) {
        response.redirect("/" + card.filename);
    });
});

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}).then((test) => {
    console.log("Connected to DB");
});

serv.listen(9000);
console.log("server started");

  
   
var SOCKET_LIST = {};
var PLAYER_LIST = []; 
var PlayerNo= 1;
var dealerPos= 1;
var guesserPos = 2;
//variables to track a position if a player leaves
var playerLeft= 0;
var players= [];
var nextGuess;
//variables to track drink amount
var firstGuess;
var secondGuess;
var numDrinks;
var drinker;
var deckPos;
var currentCard;
var currentImg;
var gameOver;

var incorrectGuesses = 0;

var guessNumber = 1;

var guessNum;

var Player = function(id){
    var self = {
        id:id,
        role: "none",
        name: id
    }
    return self;
}

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

                io.emit('newGame')
             }

            function NextDealer(){
                //if the dealer position is the last player
                console.log(players);
                console.log(PLAYER_LIST);
                console.log(dealerPos);
                PLAYER_LIST[dealerPos].role="guesser";

                if (dealerPos==players.length)
                {
                    dealerPos=1;
                }
                else{
                    dealerPos++
                }
                nextDealer= players[dealerPos];
                console.log(nextDealer)
                PLAYER_LIST[dealerPos].role="dealer";
                io.emit("playerChange",{players:players,guesserPos:guesserPos,dealerPos:dealerPos})
                
            }
            
            function NextGuesser(){
                PLAYER_LIST[guesserPos].role="player";
                console.log("changeguesser")
                //code for selecting next guesser
                       //if there are more than 2 players a new guesser is chosen. Else the guesser remains the same
                       if (players.length>2)
                       {
            
                       //if the guesser is second to last player
                       if (guesserPos==players.length-1){
                            console.log("decision 1")
                           //if the next position is the dealer we want to skip them
                           if((guesserPos++)==dealerPos)
                           {
                               guesserPos=1;
                               console.log("decision 2")
                           }
                           else{
                               guesserPos++;
                               console.log("decision 3")
                           }
            
                       }
                       //if guesser is last player
                       else if (guesserPos==players.length){
                       console.log("decision 4")
                           //if dealer is in pos 1
                           if (dealerPos==1)
                           {
                               guesserPos==2;
                               console.log("decision 5")
                           }
                           else{
                               guesserPos=1;
                               console.log("decision 6")
                           }
                        }
                        else{
                            if ((guesserPos++)==dealerPos){
                                guesserPos=guesserPos+2;
                                console.log("decision 7")
                            }
                            else{
                                guesserPos++;
                                console.log("decision 8")
                            }
                        }
            
                        console.log(players);

                        console.log("guesser pos: " +guesserPos)
                        
                        nextGuess=players[guesserPos]-1;
                        console.log("nextguess: " +nextGuess)

                        PLAYER_LIST[nextGuess].role="guesser";
                        
                        console.log(PLAYER_LIST[nextGuess].role);
                    }
            }    

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
    

var cardsPlayedNo= 0
var nextGo= false;


    
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



var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    
    socket.id = PlayerNo;
    SOCKET_LIST[socket.id] = socket;

    var player=Player(PlayerNo);
    PLAYER_LIST[PlayerNo]=(player);

    //add player to list of connected players which is accessed when changing roles
    players.push(PlayerNo);

    io.emit("playerChange",{players:players,guesserPos:guesserPos,dealerPos:dealerPos})

    PlayerNo++;

    console.log(Object.keys(PLAYER_LIST).length);

    //if there are no players start a new game with the first player as the dealer
    if(Object.keys(players).length==1){
        PLAYER_LIST[socket.id].role = "dealer";         
        NewGame();

    }

    else if(Object.keys(players).length==2){
        PLAYER_LIST[socket.id].role = "guesser";  
    }

    else if(Object.keys(players).length>2){
        PLAYER_LIST[socket.id].role = "player";
    }
    console.log(PLAYER_LIST[socket.id].role);

    var thisName= (PLAYER_LIST[socket.id].name)
    var thisRole = (PLAYER_LIST[socket.id].role)

    socket.emit("welcomeEmit",{name:thisName,role:thisRole})
 
    socket.on('display', function(){
        if (PLAYER_LIST[socket.id].role=='dealer'){
            socket.emit("currentCard",{texts:currentCard,text2:currentImg})
            
        }
    })

    socket.on('restart',function(){
        NewGame();
    })

    socket.on('guess', function(data){
        
        if (PLAYER_LIST[socket.id].role=="guesser"&&nextGo==false&&gameOver==false){
        console.log(data.text);
        

        
        var validInput = false;

         // input validation
        //finally check for a valid number between 2-14 in case card number is entered for face card
        if (data.text>1 && data.text<15)
        {
            //convert entered string to a number
            guessNum = data.text;
            validInput = true;
            console.log("1")


        }
        // //converting names of cards to its number
        else if (data.text == "A"||data.text == "a"||data.text == "Ace"||data.text == "ace")
        {
            guessNum= 14;
            validInput = true;

        }
        else if (data.text == "K"||data.text == "k"||data.text == "King"||data.text == "king")
        {
            guessNum= 13;
            validInput = true;
        }
        else if (data.text == "Q"||data.text == "q"||data.text == "Queen"||data.text == "queen")
        {
            guessNum= 12;
            validInput = true;
        }
        else if (data.text == "J"||data.text == "j"||data.text == "Jack"||data.text == "jack")
        {
            guessNum= 11;
            validInput = true;
        }


        // console.log(guessNum);
        
        var cardNum= parseInt(currentCard);

        //only continue if a valid input was entered
        if(validInput == true){
            console.log("2")

        //check entered value

        //on incorrect guess
        if (guessNum != cardNum){

        
        //on first incorrect guess
        if(guessNumber==1){


            //track number guessed for later use
            firstGuess=guessNum;

            guessNumber=2;
            //if the guess is higher than the current card
            if(guessNum>cardNum)
            {
                var lower= "lower";
                io.emit("guessWrong",{guessNum:guessNum,result:lower})
                console.log("lower");
                //code for outputting lower to screen
            }
            else if (guessNum<cardNum){
                var higher = "higher"
                io.emit("guessWrong",{guessNum:guessNum,result:higher})

                console.log("higher");
                //code for outputting higher to screen
            }
           
        }
        //if the number is not guessed correctly on the second attempt
        else if (guessNumber==2)
        {
            secondGuess= guessNum;
            //next guesser
            //NextGuesser();
            console.log("Wrong Second Time")
            //increment incorrect guesses counter
            
            incorrectGuesses++;
            console.log(incorrectGuesses);
            
            //if incorrect second time the number of drinks= difference between 2nd guess and actual card
            //if guess was lower than actual result
            if (guessNum<cardNum){
                 numDrinks= cardNum-guessNum;
                
                }
            //if guess was higher than actual result
            if(guessNum>cardNum){
                numDrinks= guessNum-cardNum;
                       
            }


            //io.emit("guessWrong",{guessNum:guessNum,result:higher})
            io.emit("secondWrong",{guessNum:guessNum,currentCard:currentImg})
            drinker=players[guesserPos-1];
            io.emit("drinks",{drinksNum:numDrinks, drinker:drinker})
            nextGo=true;
            

            //if third incorrect guess in row change dealer
            if (incorrectGuesses==3)
            {
                //PLAYER_LIST[dealerPos-1].role="player";
                console.log("changed dealer")
                NextDealer();
            }

        }
    }

        //on correct guess
        if (guessNum== currentCard){
            
            incorrectGuesses = 0;
            nextGo=true;
           // NextGuesser();
            
            
            if(guessNumber==1){
                //output drink the number guessed
                numDrinks= cardNum;

            }
            if(guessNumber==2){
                //output drinks for second guess correct
                //drinks amount=difference between first guess and actual card
                //if first guess was lower than currentcard
                if(firstGuess<cardNum){
                    numDrinks= cardNum-firstGuess;
                    

                }
                //if firstguess was more than currentcard
                if(firstGuess>currentCard){
                    numDrinks= firstGuess-cardNum;
                    numDrinks= numDrinks;


                }
            }
            
            drinker=players[dealerPos-1];
            io.emit("drinks",{drinksNum:numDrinks, drinker:drinker})

            io.emit('gotIt',{currentCard:currentCard, currentImg:currentImg});
            validInput=false;
           
    }
    NextGuesser();
}   
            if(validInput==false){
                  socket.emit("badInput",{input:data.text});
            }
    }
        
        else{
            var thisRole= PLAYER_LIST[socket.id].role;
            socket.emit("notYourGo",{role:thisRole})
            
        }
        io.emit("update");
    })

    socket.on('updateReq',function(){
        var thisName= (PLAYER_LIST[socket.id].name)
        var thisRole = (PLAYER_LIST[socket.id].role)
    

    socket.emit("welcomeEmit",{name:thisName,role:thisRole})
    })


    socket.on("getNextCard",function(){
        if ((PLAYER_LIST[socket.id].role)=="dealer"&&nextGo==true)
        {
            //if deck is empty start a new deck and emit newgame to sockets
            // if (deckPos==52)
            // {
            //     console.log("NOIDWIONDWOIN")
            //     deck = shuffle(cards);
            //     var currentCard= deck[deck.length-1];
            //     var currentImg = img[img.length-1];
            //     deck.pop();
            //     img.pop();
            //     playedCards = [];
            //     playedImgs = [];
            //     io.emit('newGame')
            // }
            // else
            // {
                if(deckPos<53){
                
                guessNumber=1;
                NextCard();
                socket.emit("currentCard", {texts:currentCard,text2:currentImg});
                nextGo=false;
                io.emit("nextTurn",{playedCards:playedImgs});

                
            }

            else if(deckPos>=53){
                gameOver=true;
            }
        }
        
        else{
            socket.emit("notYourGo",{role:PLAYER_LIST[socket.id].role})
        }
    })

    socket.on('restart',function(){   
                NewGame();
    })

    socket.on('disconnect',function(){
        players.splice((PLAYER_LIST[socket.id].id-1),1)
        

        if ((PLAYER_LIST[socket.id].role)=="dealer")
        {
            //players[(PLAYER_LIST[socket.id].id)-1].role = "dealer";
            if (players.length>0){
                // NextDealer();
            }
        }
        else if((PLAYER_LIST[socket.id].role)=="guesser")
        {
            if (players.length>1)
            {
             //NextGuesser();
            }
        }

        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
        io.emit("playerChange",{players:players,guesserPos:guesserPos,dealerPos:dealerPos})
    });
   
});

