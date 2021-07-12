var headlineEl = document.querySelector(".headline");
var questionEl = document.querySelector(".question");
var questionchoiceEl = document.querySelector(".questionchoice");
var scoresEl = document.querySelector(".scores");
var resultEl = document.querySelector(".result");
var highscoresEl = document.querySelector(".highscore");
var highscoresoptionEl = document.querySelector(".highscoresoption");
var timerEl = document.querySelector('.timer');
var highscorelistEl = document.querySelector(".Highscorelist");
var viewHighscore = document.querySelector(".page-title-left");
var backButton = document.getElementById("back-button");
var clearButton = document.getElementById("clear-button");
var startButton = document.getElementById("start-button");

//Questions list
questionlist = [ "Commonly used data types DO NOT include:" , "The condition in an if/ else statement is enclosed within _____.", "Arrays in JavaScript can be used to store _____.", "String values must be enclosed within ______ when bring assigned to variables.", "A very useful tool used during development and debugging for pricing content to the debugger is:"]
questionselection = [
    ["1. Stings", "2. Booleans", "3. Alerts", "4. Numbers"],
    ["1. Quotes", "2. Curly brackets", "3. Parentheses", "4. Square brackets"],
    ["1. Numbers and strings", "2. Other arrays", "3. Booleans", "4. All of the above"],
    ["1. Commas", "2. Curly Brackets", "3. Quotes", "4. Parentheses"],
    ["1. Javascript", "2. Terminal/ bash", "3. For loops", "4. Console.log"]
]
questionanswer=[2,2,3,2,3]

//game variables
var timer = "";
var timerCount= "";
var score = 0;

resetgame();

// The init function is called when the page loads 
function init() {
    resetgame();
}

// Attach event listener to start button to call startGame function on click
startButton.addEventListener("click", startGame);

// back to default page state
backButton.addEventListener("click", resetgame);

// clear local storage
clearButton.addEventListener("click", function (event) {
    localStorage.clear();
    showHighscores();
});

// Add event to show highest score
viewHighscore.addEventListener("click", function (event) {
    event.preventDefault();
    showHighscores();
});

// The startGame function is called when the start button is clicked
function startGame() {
  timerCount = 75;
  // Prevents start button from being clicked when round is in progress
    startButton.style.display = "none";
    headlineEl.style.display = "none";
    scoresEl.style.display = "none";
    questionEl.style.display = "block";
    questionchoiceEl.style.display = "block";
    startTimer();
    showQuestions(0);
}

//show questions
function showQuestions(Number) {
    questionEl.style.display = "block";
    questionEl.textContent = questionlist[Number];
    questionchoiceEl.innerHTML = "";
    //render answers to questionchoice
    for (var i = 0; i < questionselection[Number].length; i++) {
    var selection = questionselection[Number][i];
    var li = document.createElement("li");
    li.setAttribute("data-index", i);
    var button = document.createElement("button");
        button.textContent = questionselection[Number][i];
        button.setAttribute("class","button")
        li.appendChild(button);
        questionchoiceEl.appendChild(li); 
  }
}

//add event by clicking the answer
questionchoiceEl.addEventListener("click", function (event) {
    event.preventDefault();
    var element = event.target;
    for (var x = 0; x < questionlist.length; x++) {
        if (questionlist[x] == questionEl.textContent) {
            if (questionanswer[x] == questionselection[x].indexOf(element.textContent)) {
                checkanswer(true);
            }
            else {
                checkanswer(false);
            }
        }
    }
    //next question
    if (questionlist.indexOf(questionEl.textContent) != questionselection.length-1)
    { showQuestions(questionlist.indexOf(questionEl.textContent) + 1) }
    else
    {
        //end game
        displayscore()
    }
});

//Display answer result
function checkanswer(result) {
    resultEl.style.display = "block";
    if (result) {
        resultEl.textContent = "Correct!";
        score++;
    }
    else {
        resultEl.textContent = "Wrong!";
        timerCount = timerCount - 10;
    }
    //auto result hide in 1 sec
    setTimeout(function(){resultEl.style.display = "none"; }, 500);
}

//Display score
function displayscore() {
    clearInterval(timer);
    scoresEl.style.display = "block";
    questionchoiceEl.style.display = "none";
    resultEl.style.display = "none";
    questionEl.textContent = "All done!"
    var ptag1 = document.createElement("p");
    var ptag2 = document.createElement("p");
    ptag1.textContent = "Your final score is " + score + ".";
    ptag2.textContent="Enter initial: "
    var initial = document.createElement('input');
    var submit = document.createElement("button");
    submit.textContent ="Submit";
    submit.setAttribute("class", "button");
    submit.setAttribute("id", "submit");
    initial.setAttribute("id", "initial");
    submit.addEventListener("click", function (event) {
        var highsorces = JSON.parse(localStorage.getItem("highsorces"));    
        if (highsorces != null) {
            highsorces.push([score, document.getElementById("initial").value]);
            highsorces.sort(function(a,b) {return b[0] - a[0]});
        }
        else {
            highsorces = [[score, document.getElementById("initial").value]];
        }
        localStorage.setItem("highsorces", JSON.stringify(highsorces));
        showHighscores();
    }
    )
    ptag2.appendChild(initial);
    ptag2.appendChild(submit);
    scoresEl.appendChild(ptag1);
    scoresEl.appendChild(ptag2); 
}

// The setTimer function starts and stops the timer and triggers winGame() and loseGame()
function startTimer() {
    timerEl.textContent = "Time: " +timerCount;
    timer = setInterval(function() {
    timerCount--;
    timerEl.textContent = "Time: " +timerCount;
    // Tests if time has run out
    if (timerCount === 0) {
      // Clears interval
        clearInterval(timer);
        console.log("game over "+ scoresEl.style.display)
        //Time up end game
        if (scoresEl.style.display != "block") { displayscore(); };
    }
  }, 1000);
}

function showHighscores() {
    // Get stored value from client storage, if it exists
    var localstoredHighscores = JSON.parse(localStorage.getItem("highsorces"));
    // Hide All Element
    headlineEl.style.display = "none";
    questionEl.style.display = "none";
    questionchoiceEl.style.display = "none";
    scoresEl.style.display = "none";
    resultEl.style.display = "none";
    highscoresEl.style.display = "block";
    highscoresoptionEl.innerHTML = "";
    highscoresoptionEl.style.display = "block";
    timerEl.style.display = "none";
    startButton.style.display = "none";
    // building list item for score chart
    if (localstoredHighscores === null) {
        var li = document.createElement("li");
          li.setAttribute("style", "background-color:#e9ddfa");
        li.textContent = "No Record!";
        highscoresoptionEl.append(li);
    }
    else {
        for (var i = 0; i < localstoredHighscores.length; i++) {
            var li = document.createElement("li");
              li.setAttribute("style", "background-color:#e9ddfa");
            console.log("record " + i);
             console.log(i+1 +". " + localstoredHighscores[i][0] + " - " +localstoredHighscores[i][1]);
            li.textContent = i+1 +". " + localstoredHighscores[i][0] + " - " +localstoredHighscores[i][1];
            highscoresoptionEl.appendChild(li);
        }
    }
}

//Reset game, hide all section except the headline
function resetgame(){
    headlineEl.style.display = "block";
    resultEl.style.display = "none";
    scoresEl.style.display = "none";
    highscoresEl.style.display = "none";
    highscoresoptionEl.style.display = "none";
    timerEl.style.display = "block";
    questionEl.innerHTML = "";
    questionchoiceEl.innerHTML = "";
    startButton.style.display = "block";
    scoresEl.innerHTML = "";
    timerCount = "";
    timerEl.textContent = "Time: 0";
    score = "0";
}