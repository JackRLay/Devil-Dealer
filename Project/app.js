var express = require('express');
var app = express();
var serv = require('http').Server(app);
var schemas = require("./schemas");
// var mongoose = require("mongoose");
// var MongoClient = require("mongodb").MongoClient;
var sdb = require("./db");
 
// var uri = "mongodb+srv://dbUser:dbUser@devildealer-kzeuz.mongodb.net/test?retryWrites=true&w=majority";

var results;

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
 
app.get("/card/:id", function(request, response){
    schemas.getCard(reqest.params.id).then(function(card){
        response.redirect("/"+card.filename);
    })
})

serv.listen(2000);
console.log("Server started.");

//connect to mongoose
    // mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology:true}).then
    // ((test) => {
    //     console.log("Connected to DB");
    
    // });

    // MongoClient.connect(uri, function(err,db){       ///NEEDED
    //     if(err) throw err;        
    //     var dbo = db.db("DevilDealer");
    //     results = dbo.collection("cards").find({});
    //     console.log("db connected 2");
    //     console.log(results);
    // })
 
   
var SOCKET_LIST = {};
var PLAYER_LIST = {}; 
var PlayerNo= 1;
var dealerPos= 1;
var guesserPos = 2;
//variables to track a position if a player leaves
var playerLeft= 0;
var missing= [];

var incorrectGuesses = 0;

var guessNumber = 1;

var guessNum;

var Player = function(id){
    var self = {
        id:id,
        role: "none",
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

}

return array;}
    
var deck = shuffle(cards);

var currentCard= deck[deck.length-1];
deck.pop();
var playedCards = [];

    



var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id = PlayerNo;
    SOCKET_LIST[socket.id] = socket;

    var player=Player(socket.id);
    PLAYER_LIST[socket.id]= player;

    console.log(Object.keys(PLAYER_LIST).length);

    console.log(PLAYER_LIST[socket.id].id);
    
    if(Object.keys(PLAYER_LIST).length==1){
        PLAYER_LIST[socket.id].role = "dealer";                 
    }

    else if(Object.keys(PLAYER_LIST).length==2){
        PLAYER_LIST[socket.id].role = "guesser";  
    }

    else if(Object.keys(PLAYER_LIST).length>2){
        PLAYER_LIST[socket.id].role = "player";
    }
 
    socket.on('guess', function(data){
        if (PLAYER_LIST[socket.id].role=="guesser"){
        console.log(data.text);

        
        var validInput = false;

  
        //converting names of cards to its number
        if (data.text == "A")
        {
            guessNum= 14;
            validInput = true;
            console.log("workeda");
        }
        else if (data.text == "K")
        {
            guessNum= 13;
            validInput = true;
            console.log("workedk");
        }
        else if (data.text == "Q")
        {
            guessNum= "12";
            validInput = true;
            console.log("workedq");
        }
        else if (data.text == "J")
        {
            guessNum= 11;
            validInput = true;
            console.log("workedj");
        }

        //input validation
        //finally check for a valid number between 2-14 in case card number is entered for face card
        else if (data.text>1 && data.text<15);
        {
            //convert entered string to a number
            guessNum = data.text;
            validInput = true;


        }


        console.log(guessNum);
        
        var cardNum= parseInt(currentCard);

        //only continue if a valid input was entered
        if(validInput == true){

        //check entered value

        //on incorrect guess
        if (guessNum != cardNum){

        
        //on second incorrect guess
        if(guessNumber==1){
            guessNumber=2;
            //if the guess is higher than the current card
            if(guessNum>cardNo)
            {
                console.log("lower");
                //code for outputting lower to screen
            }
            else if (guessNum<cardNo){
                console.log("higher");
                //code for outputting higher to screen
            }
           
        }
        //if the number is not guessed correctly on the second attempt
        else if (guessNumber==2)
        {
            //increment incorrect guesses counter
            incorrectGuesses++;

            //if third incorrect guess in row change dealer
            if (incorrectGuesses==3)
            {
                //set dealer to a player
                PLAYER_LIST[socket.id].role="player";
                //set next player to be a dealer
                dealerPos++;
                PLAYER_LIST[dealerPos].role="dealer";
            }

        }
    }

        //on correct guess
        if (guessNum== currentCard){
            incorrectGuesses = 0;
            
            console.log("gotit");
            
            if(guessNumber==1){
                //output drink double the number guessed
            }
            if(guessNumber==2){
                //output drink diff
            }


            //code for selecting next guesser
            //if there are more than 2 players a new guesser is chosen. Else the guesser remains the same
            if (Object.keys(PLAYER_LIST).length>2)
            {
            //if the guesser is second to last player
            if (guesserPos==Object.keys(PLAYER_LIST).length-1){
            
                //if the next position is the dealer we want to skip them
                if((guesserPos++)==dealerPos)
                {
                    guesserPos=1;
                }
                else{
                    guesserPos++;
                }

            }
            //if guesser is last player
            else if (guesserPos==Object.keys(PLAYER_LIST).length)
                //if dealer is in pos 1
                if (dealerPos==1)
                {
                    guesserPos==2;
                }
                else{
                    guesserPos=1;
                }
             }
             else{
                 if ((guesserPos++)==dealerPos){
                     guesserPos=guesserPos+2;
                 }
                 else{
                     guesserPos++;
                 }
             }

             PLAYER_LIST[socket.id].role="player";
             console.log(PLAYER_LIST[socket.id].role);
             PLAYER_LIST[1].role="guesser";
             
             console.log(guesserPos);
    }
}   
        }
        else{
            console.log("not your go");
            console.log(PLAYER_LIST[socket.id].role);
        }
    })

    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });
   PlayerNo++;
});
 
// setInterval(function(){
//     var pack = [];
//     for(var i in PLAYER_LIST){
//         var player = PLAYER_LIST[i];
        
                
//         });    
//     }
//     for(var i in SOCKET_LIST){
//         var socket = SOCKET_LIST[i];
//         socket.emit('newPositions',pack);
//     }
   
   
   
   
// },1000/25);