var displaying= false;
    var socket = io();
    var card= document.createElement("img");
    var guessText= document.createElement("P");
    var playerList= document.createElement("P");
    var guesser= document.createElement("P");
    var dealer= document.createElement("P");
    var drinkText = document.createElement("P");
    var players= [];
    var secondGuess=[];
    var cardsPlayed=[];
    
    socket.on('currentCard', function(data){
        
        console.log(data.texts);
        console.log(data.text2);
        
        

        if (displaying==false)
        {
        
        card.src = "http://localhost:9000/card/"+data.text2;
        document.getElementById("currentCard").appendChild(card);       
        displaying = true;
        }
        else if (displaying==true)
        {
            card.src = "http://localhost:9000/card/53";
            document.getElementById("currentCard").appendChild(card); 

            displaying =false;
        }

        
    })
    socket.on('secondWrong', function(data){
    
        console.log(data.currentCard)
        secondGuess= data.guessNum;
        currentCard= data.currentCard;

        guessText.innerText= "Guesser guessed:"+secondGuess+"\n Incorrect!\n The card was: ";
        document.getElementById("output").appendChild(guessText)
        card.src = "http://localhost:9000/card/"+currentCard;
        document.getElementById("currentCard").appendChild(card);  



    })
    socket.on('gotIt', function(data){
  
        currentImg= data.currentImg;
        currentCard= data.currentCard;

        guessText.innerText= "Guesser guessed:"+currentCard+"\n Correct!";
        document.getElementById("output").appendChild(guessText)

        card.src = "http://localhost:9000/card/"+currentImg;
        document.getElementById("currentCard").appendChild(card);  


    })

    socket.on('notYourGo', function(data){
        alert("It is not your turn. Your role is: "+data.role);
    })

    socket.on('nextTurn',function(data){
        card.src = "http://localhost:9000/card/53";
            document.getElementById("currentCard").appendChild(card);
            socket.emit("updateReq");
            var playedCards = data.playedCards;
            console.log(data.playedCards);

            //get every played card and display on screen
            for (let i = 0; i < playedCards.length; i++) {
                var currentCard= playedCards[i];
                
                var cardToDisp= document.createElement("img");              
                
                cardToDisp.src = "http://localhost:9000/card/"+currentCard;

                             
                document.getElementById(currentCard).appendChild(cardToDisp);  

            }
            //reset game information labels
            drinkText.innerText= "";
         document.getElementById("drinks").appendChild(drinkText);
            guessText.innerText= "";
            document.getElementById("output").appendChild(guessText)
        })

    socket.on('newGame',function(){
        //code for starting a new game
        //delete cards on screen
        //can keep same guesser and dealer
        var images= document.getElementsByTagName('img');
        for (let index = 0; index < images.length; index++) {
            //clear table on new game
            images[0].parentNode.removeChild(images[0]);
            //document.getElementById(num).appendChild("");
            var header= document.createElement("img")
            header.src = "ddlogo.png";
            document.getElementById('head').appendChild(header)
            
        }
    })

    socket.on('drinks', function(data){
        var drinker= data.drinker;
        var drinks= data.drinksNum;

        drinkText.innerText= "Player: "+drinker+" must consume: "+drinks+" times";

        document.getElementById("drinks").appendChild(drinkText);
        
    })

    socket.on('welcomeEmit', function(data){       
         document.getElementById('player').innerHTML = "Welcome: "+data.name+". Your role is: "+data.role;
    })
    
    socket.on('guessWrong', function(data){
        console.log(data.guessNum, data.result)
        
         guessText.innerText= "Guesser guessed:"+data.guessNum+"\n Incorrect!\n The card is "+data.result;
         document.getElementById("output").appendChild(guessText)
    })

    socket.on('playerChange', function(data){
         players= data.players;
         guesserPos= data.guesserPos-1;
         console.log(guesserPos)
        var guesserName= players[guesserPos];
        console.log(guesserName);
         dealerPos= data.dealerPos-1;
         console.log(dealerPos)
        var dealerName= players[dealerPos];

        document.getElementById('listPlayers').innerHTML = "Players in game: "+players;
        document.getElementById('guesser').innerHTML = "Guesser: "+guesserName;
        document.getElementById('dealer').innerHTML = "Dealer: "+dealerName;
        
    })
    socket.on('update', function(){
        socket.emit('updateReq');
        
    })

    socket.on('badInput',function(data){
        alert(data.text+" is not a valid guess. Please enter a number between 2-10 or the name of a face card");
    })

    function nextCard(){
        socket.emit("getNextCard")
        displaying=false;
        

    }


    function guess(){
        var text =document.getElementById("textBox").value;
        socket.emit("guess",{text:text})
    }

    function displayCard(){
        socket.emit("display");
    }

    function restart(){
        socket.emit("restart");
    }
    
