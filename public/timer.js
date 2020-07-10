// Simple Function for Timer. Didnt implement any anti tampering measures, because no time constraint in Quiz.

let sec = 0;
let min = 0;

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
    $("#clock").text(timeString);
    sessionStorage.setItem("minutesElapsed", min);
    sessionStorage.setItem("secondsElapsed", sec);
}, 1000);