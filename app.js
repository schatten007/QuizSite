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

// Quiz Questions Data //

let questions = [];
let apiQuestions = [];
let selectedOptions = [];

let currentQuestion = 0;
let totalCorrect = 0;
let totalIncorrect = 0;

// End Quiz Questions //

// Start API Parameters //
let amountRequest = 10;
let difficultyRequest = "easy";
// End API Parameters //

// Start GET Routes //

//  To Display Quiz Question Saved in Quiz Array
app.get("/quiz", function (req, res) {
    let question = questions[currentQuestion].ask;
    let options = questions[currentQuestion].options;
    shuffle(options);
    res.render("quiz", { question: question, options: options, total: questions.length, currentQuestion: currentQuestion });
});

// To Display the Quiz Modification Form
app.get("/quiz-modify", function (req, res) {
    resetAll();
    res.render("quiz-modifier");
});

// To Generate Random Quiz Question
app.get("/make-quiz", function (req, res) {

    console.log(amountRequest);
    console.log(difficultyRequest);
    // Api Parameters
    let amount = amountRequest;
    let category = 18;
    let difficulty = difficultyRequest;
    let type = "multiple";
    let encoding = "url3986";
    // End of Parameters

    let url = "https://opentdb.com/api.php?" + "amount=" + amount + "&category=" + category + "&difficulty=" + difficulty + "&type=" + type + "&encode=" + encoding;

    //  Make an HTTPS Get request to OpenTriviaDB API To get Quiz Questions
    https.get(url, function (response) {

        console.log(response.statusCode);

        response.on("data", function (data) {
            let apiData = JSON.parse(data);
            apiQuestions = apiData.results;
            convertQuestions();
            res.redirect("/quiz");
        });

    });
});

app.get("/quiz/result", function (req, res) {
    res.render("quiz-results", { questions: questions, selectedOption: selectedOptions, correct: totalCorrect, incorrect: totalIncorrect });
});

// End Get Routes //

// Start POST Routes //

app.post("/quiz/submit", function (req, res) {
    console.log(req.body);
    let selected = req.body.option;
    let correct = questions[currentQuestion].answer;
    selectedOptions.push(selected);
    if (selected === correct) {
        totalCorrect++;
    }
    else {
        totalIncorrect++;
    }
    if (currentQuestion < questions.length - 1) {
        res.redirect("/quiz");
        currentQuestion++;
    }
    else {
        res.redirect("/quiz/result");
    }

});

app.post("/quiz-modifier", function (req, res) {
    amountRequest = req.body.number;
    difficultyRequest = req.body.difficulty;
    res.redirect("/make-quiz");
});

// End Post Routes //

// Functions

// Converting Questions From API's Format To Mine

function convertQuestions() {
    console.log("Converting Questions");
    let q = apiQuestions[0].question;
    let o = apiQuestions[0].incorrect_answers;
    let a = apiQuestions[0].correct_answer;
    let templateQuestion = {
        ask: q,
        options: o,
        answer: a
    };
    apiQuestions.forEach(function (question) {
        q = decodeURIComponent(decodeURIComponent(question.question));
        o = question.incorrect_answers;
        for (var i = 0; i < o.length; i++) {
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

function resetAll() {
    questions = [];
    apiQuestions = [];
    selectedOptions = [];

    currentQuestion = 0;
    totalCorrect = 0;
    totalIncorrect = 0;
}