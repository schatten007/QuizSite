const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const array = require('lodash/array');
const app = express();
const https = require("https");
const shuffle = require("shuffle-array");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen("3000", function () {
    console.log("Started server on port 3000");
});

// Quiz Questions
let questions = [];
let apiQuestions = [];

let currentQuestion = 0;
// End Quiz Questions

// Start API Parameters
let amountRequest = 10;
let difficultyRequest = "easy";
// End API Parameters

// Start GET Routes
app.get("/", function (req, res) {
    let question = questions[currentQuestion].ask;
    let options = questions[currentQuestion].options;
    shuffle(options);
    res.render("quiz",{question: question, options: options});
});

app.get("/quiz-modify",function(req,res){
    res.render("quiz-modifier");
});

app.get("/make-quiz",function(req,res){
    
    // Api Parameters
     let amount = 10;
     let category = 18;
     let difficulty = "easy";
     let type = "multiple";
     let encoding = "url3986";
     // End of Parameters

     let url = "https://opentdb.com/api.php?" + "amount=" + amount + "&category=" + category + "&difficulty=" + difficulty + "&type=" + type + "&encode=" + encoding;
     console.log(url);
    //  Make an HTTPS Get request to OpenTriviaDB API To get Quiz Questions
     https.get(url,function(response){
        
        console.log(response.statusCode);

        response.on("data",function(data){
            let apiData = JSON.parse(data);
            apiQuestions = apiData.results;
            convertQuestions();
            res.redirect("/");
        });

     });
});
// End Get Routes

// Start POST Routes

app.post("/submit",function(req,res){
    console.log(req.body);
    let selected = req.body.option;
    let correct = questions[currentQuestion].answer;
    if (currentQuestion <= questions.length)
    {
        if (selected === correct)
        {
            currentQuestion++;
            res.redirect("/");
        }
        else{
            console.log("FUCKER!");
        }
    }
    else{
        res.redirect("/quiz/complete");
    }

});

app.post("/quiz-modifier",function(req,res){
    amountRequest = req.body.number;
    difficultyRequest = req.body.difficulty;
    res.redirect("/make-quiz");
});

// End Post Routes

// Functions

// Converting Questions From API's Format To Mine
function convertQuestions()
{
    console.log("Converting Questions");
    let q = apiQuestions[0].question;
    let o = apiQuestions[0].incorrect_answers;
    let a = apiQuestions[0].correct_answer;
    let templateQuestion = {
        ask: q,
        options: o,
        answer: a
    };
    apiQuestions.forEach(function(question){
        q = decodeURIComponent(decodeURIComponent(question.question));
        o = question.incorrect_answers;
        for(var i=0; i<o.length; i++){
            o[i] = decodeURIComponent(decodeURIComponent(o[i]));
        }
        a = decodeURIComponent(decodeURIComponent(question.correct_answer));
        o.push(a);
        question = {
            ask: q,
            options: o,
            answer: a
        };
        questions.push(question)
    });
    console.log("Successfully Converted Questions");
    console.log(questions);
}