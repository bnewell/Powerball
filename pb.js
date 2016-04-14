// returns array of 5 numbers between 1-69, no duplicates
function generateWhiteBalls() {
    var whiteBalls = [];
    var count = 0;
    while (count < 5) {
        var whiteBall = getBall(false);
        // no dups
        if ((whiteBalls.indexOf(whiteBall)) == -1) {
          whiteBalls.push(whiteBall);
          count++;
        }
    }
    return whiteBalls;
}

// DISPLAY MAIN WINNING POWERBALL NUMBERS
function displayBalls() {
    /* 
        a play will be thought of as 2 chars, actually an int
        first num is number of white, second is powerball/red
        "00" is 0 white, 0 red
        "10" is 1 white, 0 red
        "21" is 2 white, 1 red 
    */
    BESTPLAY = 0;
    MONEYWON = 0;
    PLAYCOUNT = 0;
    // get winning numbers
    //table:nth-child(1) td[align=center]
    WINNINGNUMS = generateWhiteBalls();
    var powerBall = getBall(true);
    WINNINGNUMS.push(powerBall);
    // set winning numbers on page
    var ballList = document.getElementById('winningNumbers')
    ballList.innerHTML = "";
    for (var i = 0; i < 6; i++) {
        var ballListItem = document.createElement("li");
        ballListItem.setAttribute("id", "winningBall" + i);
        ballListItem.appendChild(document.createTextNode(WINNINGNUMS[i]));
        ballList.appendChild(ballListItem);
    }
}

function play(){
  PLAYCOUNT++;
  // remove ball glow
  for(var i = 0; i < WINNINGNUMS.length; i++){
    var ball = document.getElementById("winningBall" + i);
    ball.removeAttribute("class");
  }
  // get current play
  var currentPlay = generateWhiteBalls();
  var powerBall = getBall(true);
  currentPlay.push(powerBall); 
  // highlight won balls
  var whiteCount = 0;
  for(var i = 0; i < WINNINGNUMS.length - 1; i++){
    for(var j = 0; j < currentPlay.length - 1; j++){
        if(WINNINGNUMS[i] == currentPlay[j]){
            var ball = document.getElementById("winningBall" + i);
            ball.setAttribute("class", "glow");
            whiteCount++;
        }
    }
  }
  // highlight powerball
  var pb = 0;
  if(WINNINGNUMS[5] == currentPlay[5]){
    var ball = document.getElementById("winningBall5");
    ball.setAttribute("class", "glow");
    pb = 1;
  } 
  // convert white and pb count into a "play"
  var play = parseInt("" + whiteCount + pb);
  // update money. 10 and 20 are just 1 and 2 whiteballs
  if(play != 0 && play != 10 && play != 20){
    // we won something
    if(play <= 11){
        // $4
        // 0 white 1 red
        // 1 white 1 red
        MONEYWON += 4;
    } else if(play <= 30){
        // $7
        // 2 white 1 red
        // 3 white 0 red
        MONEYWON += 7;
    } else if(play <= 40){
        // $100
        // 3 white 1 red
        // 4 white 0 red
        MONEYWON += 100;
    } else if(play <= 41){
        // $50,000
        // 4 white 1 red
        MONEYWON += 50000;
    } else if(play <= 50){
        // $1,000,000
        // 5 white 0 red
        MONEYWON += 1000000;
    } else {
        // $jackpot
        // 5 white 1 red
        MONEYWON = 999999999;
    }
    // save best play
    if(play > BESTPLAY){
        BESTPLAY = play;
        // update best play
        var thePlay = document.getElementById("bestPlay");
        thePlay.innerHTML = whiteCount + " White; " + pb + " Powerball";
        thePlay.setAttribute("title", currentPlay);
    }  
  }
  
  // list plays in text area
  var textarea = document.getElementById('playNums');
  for(var i = 0; i < currentPlay.length-1; i++){
    var node = "";
    var space = i == currentPlay.length-1 ? "" : " ";
    if(currentPlay[i] < 10){
        // pad single digits with zero
        node = document.createTextNode("0" + currentPlay[i] + space);
    } else {
        // no pad necessary
        node = document.createTextNode(currentPlay[i] + space);
    }
    textarea.appendChild(node);
  }
  textarea.appendChild(document.createTextNode("  " + powerBall));
  textarea.appendChild(document.createTextNode("\n"));
  textarea.scrollTop = textarea.scrollHeight;    
  // display money spent
  moneySpent = document.getElementById("moneySpent");
  moneySpent.innerHTML = PLAYCOUNT * 2;
  // display money won
  myMoneyWon = document.getElementById("moneyWon");
  moneyWon.innerHTML = MONEYWON;
  // display win or lose
  var waysToSayNo = [
  	"Nope.", "False.", "I Wish.", "Nah.", 
    "No.", "Hell No.", "In My Dreams.", 
    "Maybe Next Time.", "Dude.", "U Srs?",
    "Lolwut?", "Never.", "Not Even Close.", 
    "I Quit.", "I Suck.", "Money Wasted.",
    "You Tellin' Me There's A Chance?", "One More Try.",
    "I Give Up.", "No!", "No Way, Jose!"
  ];
  var whichNo = Math.ceil((Math.random() * waysToSayNo.length) -1);
  var theNo = waysToSayNo[whichNo];
  var winner = document.getElementById("didYouWin");
  if(currentPlay != WINNINGNUMS){
    winner.innerHTML = theNo;
  } else {
    playForMe();
  	winner.innerHTML = "Holy Shit. You Won!"
  }
}

function playForMe(){
    var playStop = document.getElementById("playStop");
    // on first run, TIMER will be undefined
    // it gets defined for the first time here 
    if(window.TIMER == undefined || TIMER == 0){
        TIMER = setInterval(play, 50);
        playStop.innerHTML = "Stop";
    } else {
        clearInterval(TIMER);
        TIMER = 0;
        playStop.innerHTML = "Play for Me";
    }
}

function closePopup(id){
    var popup = document.getElementById(id);
    popup.style.display = 'none';
}

function openPopup(e, id){
    var popup = document.getElementById(id);
    popup.style.display = 'block';
    // open popup centered on click
    var popupInfo = popup.getBoundingClientRect();
    var correction = popupInfo.width / 2;
    popup.style.top = e.pageY + 'px';
    popup.style.left = e.pageX - correction + 'px';
}

// Powerball: 1-26 
// Whiteball: 1-69
function getBall(isPowerBall) {

  return isPowerBall ? Math.floor((Math.random() * 26) + 1) : Math.floor((Math.random() * 69) + 1);

}

