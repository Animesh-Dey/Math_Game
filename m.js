// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionamount = 0;
let equationsArray = [];
let playerguessarray=[];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timeplayed=0;
let basetime=0;
let penaltytime=0;
let finaltime=0;
let finaltimedisplay='0.0s';


// Scroll
let valuey=0;

//re-set game
function playagain(){
    gamePage.addEventListener('click',starttimer);
    scorePage.hidden=true;
    splashPage.hidden=false;
    equationsArray=[];
    playerguessarray=[];
    valuey=0;
    playAgainBtn.hidden=true;
}

//show score page
function showscorepage(){
    //show play again button after 1s
    setTimeout(()=>{
playAgainBtn.hidden=false;
    }),1000;
    gamePage.hidden=true;
    scorePage.hidden=false;

}

//format and display timee in dom
function scorestodom(){
    finaltimedisplay=finaltime.toFixed(1);
    basetime=timeplayed.toFixed(1);
    penaltytime=penaltytime.toFixed(1);
    baseTimeEl.textContent=`Base Time: ${basetime}s`;
    penaltyTimeEl.textContent=`Penalty Time: ${penaltytime}s`;
    finalTimeEl.textContent=`${finaltimedisplay}s`;
    //scroll to top , go to score page
    itemContainer.scrollTo({ top:0, behaavior: 'instant'});
    showscorepage();
}

//stop timer,process results, go to score page
function checktime(){
    if(playerguessarray.length==questionamount){
        clearInterval(timer);
        //check for wrong guesses, add penalty time
        equationsArray.forEach((equation,index)=>{
          if(equation.evaluated===playerguessarray[index]){
              //correct guess,no penalty

          }
          else{
              //penalty 
              penaltytime+=0.5;
          }
        });
        finaltime=timeplayed+penaltytime;
        scorestodom();
    }
}

//add a tenth of  a sec to timeplayed
function addtime(){
    timeplayed+=0.1;
  checktime();
}

//start timer when game page is clicked
function starttimer(){
    timeplayed=0;
    penaltytime=0;
    finaltime=0;
    timer=setInterval(addtime,100);
    gamePage.removeEventListener('click',starttimer);
}

//scroll , store user selection in playerguessarray
function select(gussedtrue){
    //console.log(playerguessarray,'p');
    //scroll 80pixel
    valuey+=80;
    itemContainer.scroll(0,valuey);
    //add player guess to array
    return gussedtrue?playerguessarray.push('true'):playerguessarray.push('false');;
}

//display game page
function showgamepage(){
    gamePage.hidden=false;
    countdownPage.hidden=true;
}

//get raandom numbeer up to a max number
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


// Create Correct/Incorrect Random Equations
function createEquations() {
    // Randomly choose how many correct equations there should be
    const correctEquations = getRandomInt(questionamount);
    console.log(correctEquations);
    // Set amount of wrong equations
    const wrongEquations = questionamount - correctEquations;
    console.log(wrongEquations);
    // Loop through, multiply random numbers up to 9, push to array
    for (let i = 0; i < correctEquations; i++) {
        firstNumber = getRandomInt(9);
        secondNumber = getRandomInt(9);
        const equationValue = firstNumber * secondNumber;
        const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
        equationObject = { value: equation, evaluated: 'true' };
        equationsArray.push(equationObject);
    }
    //Loop through, mess with the equation results, push to array
    for (let i = 0; i < wrongEquations; i++) {
        firstNumber = getRandomInt(9);
        secondNumber = getRandomInt(9);
        const equationValue = firstNumber * secondNumber;
        wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
        wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
        wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
        const formatChoice = getRandomInt(3);
        const equation = wrongFormat[formatChoice];
        equationObject = { value: equation, evaluated: 'false' };
        equationsArray.push(equationObject);
    }
    shuffle(equationsArray);
    //console.log(equationsArray);
    //equationstodom();
}

//add equations to dom
function equationstodom(){
    equationsArray.forEach((equation)=>{
     //item 
     const item=document.createElement('div');
     item.classList.add('item');
     //equation text
     const equationtext=document.createElement('h1');
     equationtext.textContent=equation.value;
     //append
     item.appendChild(equationtext);
     itemContainer.appendChild(item);
    });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationstodom();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}
function countdownstart() {
    countdown.textContent = '3';
    setTimeout(() => {
        countdown.textContent = '2';
    }, 1000);
    setTimeout(() => {
        countdown.textContent = '1';
    }, 2000);
    setTimeout(() => {
        countdown.textContent = 'GO!';
    }, 3000);
}

//navigate from spalsh page to countdown page
function showcountdown() {
    countdownPage.hidden = false;
    splashPage.hidden = true;
    countdownstart();
    //createEquations();
    populateGamePage();
    setTimeout(showgamepage, 4000);
}

//Get the value of our selected radio value
function getradiovalue() {
    let radiovalue;
    radioInputs.forEach((radioInput) => {
        if (radioInput.checked) {
            radiovalue = radioInput.value;
        }
    });
    return radiovalue;
}

//function that decides amount of qustions
function selectquestionamount(e) {
    e.preventDefault();
    questionamount = getradiovalue();
   // console.log(questionamount);
    if (questionamount) {
        showcountdown();
    }

}

startForm.addEventListener('click', () => {
    radioContainers.forEach((radioel) => {
        //remove selected label styling
        radioel.classList.remove('selected-label');
        //add it back if radio  input is checked
        if (radioel.children[1].checked) {
            radioel.classList.add('selected-label');
        }
    })
});


//event listners
startForm.addEventListener('submit', selectquestionamount);
gamePage.addEventListener('click',starttimer);