const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const array = require('lodash/array');
const app = express();
const https = require("https");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen("3000", function () {
    console.log("Started server on port 3000");
});

// Quiz Questions
const questions = [];
let question = {
    ask: "Name of Pakistans Capital?",
    options: ["Alaska","Ontario","Fag","Islamabad"],
    answer: "Islamabad"
}
questions.push(question);

let currentQuestion = 0;
// End Quiz Questions

// Get Routes
app.get("/", function (req, res) {
    res.render("quiz");
});

app.get("/make-quiz",function(req,res){
    console.log("Making Quiz");
     // Api Parameters
     let amount = 10;
     let category = 18;
     let difficulty = "easy";
     let type = "multiple";
     // End of Parameters
     let url = "https://opentdb.com/api.php?" + "amount=" + amount + "&category=" + category + "&difficulty=" + difficulty + "&type=" + type;
     console.log(url);
    //  Make an HTTPS Get request to open trivia db api
     https.get(url,function(response){
        
        console.log(response.statusCode);

        response.on("data",function(data){
            let apiData = JSON.parse(data);
            let apiQuestions = apiData.results;
            
            console.log(apiData.results);
        });
     });
});
app.get("/quiz",function(req,res){
   
    let question = questions[currentQuestion].ask;
    let oA = questions[currentQuestion].options[0];
    let oB = questions[currentQuestion].options[1];
    let oC = questions[currentQuestion].options[2];
    let oD = questions[currentQuestion].options[3];

    res.render("form",{ask: question, optionA: oA, optionB: oB, optionC: oC, optionD: oD});
});
// End Get Routes

// Post Routes

app.post("/submit",function(req,res){
    let selected = req.body.option;
    let correct = questions[currentQuestion].answer;
    if (currentQuestion <= questions.length)
    {
        if (selected === correct)
        {
            currentQuestion++;
            res.redirect("/quiz");
        }
        else{
            console.log("FUCKER!");
        }
    }
    else{
        res.redirect("/quiz/complete");
    }

});

// End Post Routes

// Randomize Outputs

