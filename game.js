const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader= document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswer = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];


let questions = [];

fetch("https://opentdb.com/api.php?amount=20&category=9&difficulty=easy&type=multiple").then(res =>{
    return res.json();
}).then(loadedQuestion=>{
    questions = loadedQuestion.results.map(questions=>{
      console.log(questions);  
        const formattedQuestion = {
            question : questions.question
        };
        const answerChoices = [...questions.incorrect_answers]
        formattedQuestion.answer = Math.floor(Math.random()*3)+1;
        answerChoices.splice(formattedQuestion.answer -1 , 0, questions.correct_answer)

        answerChoices.forEach((choice, index)=>{
            formattedQuestion["choice" + (index+1)] = choice;
        })
        return formattedQuestion;
    })  

    game.classList.remove('hidden');
    loader.classList.add('hidden');
    startGame();
}).catch(err=>{
    console.error(err);
})

//constant 
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
}

getNewQuestion = () => {
    if(availableQuestions.length ===0 || questionCounter>=MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore', score);
        //go to end page
        return window.location.assign("/Quiz-App/end.html")
    }
    questionCounter++;
    progressText.innerText = `Question: ${questionCounter}/${MAX_QUESTIONS}`
    // update progress bar
    progressBarFull.style.width  = `${(questionCounter/MAX_QUESTIONS)*100}%`;

    const questionIndex = Math.floor(Math.random()*availableQuestions.length)
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice=>{
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice'+number];
    })

    availableQuestions.splice(questionIndex , 1);
    acceptingAnswer = true;
}

choices.forEach(choice =>{
    choice.addEventListener('click', e=>{
        if(!acceptingAnswer)return ;
        acceptingAnswer = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply = ( selectedAnswer == currentQuestion.answer )  ?  'correct' : 'incorrect';
        
        selectedChoice.parentElement.classList.add(classToApply);
        if(classToApply === 'correct'){
            incrementScore(CORRECT_BONUS);
        }
        setTimeout(()=>{
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 400);
        
    })
})


incrementScore= num=>{
    score+=num;
    scoreText.innerText = score;
}
