// Simple Function for Timer. Didnt implement any anti tampering measures, because no time constraint in Quiz.

let sec = 0;
let min = 0;

let clock = document.querySelector("#clock");
let currentQuestion = document.querySelector("#question-count");
let questionText = currentQuestion.textContent.slice(0,1);

if(questionText == "0")
{
    sessionStorage.removeItem("secondsElapsed");
    sessionStorage.removeItem("minutesElapsed");
}
let storedSec = sessionStorage.getItem("secondsElapsed");
let storedMin = sessionStorage.getItem("minutesElapsed");

if (storedMin != null)
{
    min = storedMin;
}
if (storedSec != null)
{
    sec = storedSec;
}

setInterval(function(){
    sec++;
    if (sec>=60)
    {
        min++;
        sec = 0;
    }
    let timeString = "";
    if (min<10)
    {
        if (sec<10)
        {
            timeString = "0" + min + ":0" + sec; 
        }
        else{
            timeString = "0" + min + ":" + sec; 
        }
    }
    else{
        if (sec<10)
        {
            timeString =  min + ":0" + sec; 
        }
        else{
            timeString = min + ":" + sec; 
        }
    }
    clock.textContent = (timeString);
    sessionStorage.setItem("minutesElapsed", min);
    sessionStorage.setItem("secondsElapsed", sec);
}, 1000);

let totalQuestion = document.querySelector("#question-count").textContent;
totalQuestion = totalQuestion.slice(2,totalQuestion.length);
console.log(totalQuestion);

let questionCount = 0;

console.log(questionText);
if(questionText > 0)
{
    questionCount = sessionStorage.getItem("qCount");
}

questionCount++;
sessionStorage.setItem("qCount", questionText);
console.log(questionCount);

let btn = document.querySelector(".btnio");

if(questionCount>=totalQuestion)
{
    console.log("Hack WORKS!");
    btn.disabled = true;
}
