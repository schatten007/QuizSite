const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const array = require('lodash/array');
const app = express();

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
question = {
    ask: "Name of Afghanistans Capital?",
    options: ["Alaska","Kabul","Fag","Islamabad"],
    answer: "Kabul"
}
questions.push(question);

let currentQuestion = 0;
// End Quiz Questions

// Get Routes
app.get("/", function (req, res) {
    res.render("home");
});

app.get("/quiz",function(req,res){

    let question = questions[currentQuestion].ask;
    let oA = questions[currentQuestion].options[0];
    let oB = questions[currentQuestion].options[1];
    let oC = questions[currentQuestion].options[2];
    let oD = questions[currentQuestion].options[3];

    res.render("form",{ask: question, optionA: oA, optionB: oB, optionC: oC, optionD: oD});
});
app.get("/quiz/:status",function(req,res){
    let requested = _.lowerCase(req.params.status);
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

