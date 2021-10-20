let current_questions;
let current_answers;

/* 
    Make Quiz
*/
//Reset container and add HTML to get data
function makeQuiz(){
    let container = document.getElementById('container')
    current_questions = [];
    current_answers = [];
    container.innerHTML = "";
    container.innerHTML = `
    <div id="makeQuiz">
            <label for="input_title--quiz">Title</label><input type="text" id="input_title--quiz" placeholder="Title">
            <div id="question">
                <div><label for="input_title">Question</label><input type="text" id="input_title" placeholder="Question"></div>
                <div><label for="option1">Option 1</label><input type="text" placeholder="Option 1" id="option1" class="option"><input type="radio" name="option" value="option1" checked></div>
                <div><label for="option2">Option 2</label><input type="text" placeholder="Option 2" id="option2" class="option"><input type="radio" name="option" value="option2"></div>
            </div>
            <button onclick="addOtherOption()">Add option</button>
            <button onclick="addQuestion()">Add Question</button><br>
            <button onclick="generateQuiz()">Generate Quiz</button>
        </div>
    `;
}

//Add another option item (label, input and radio button)
function addOtherOption(){
    let question_container = document.getElementById('question');
    let number_question = question_container.childElementCount;

    let element = document.createElement('div');
    element.innerHTML += `<label for="option${number_question}">Option ${number_question}</label><input type="text" placeholder="Option ${number_question}" id="option${number_question}" class="option"><input type="radio" name="option" value="option${number_question}">`;

    question_container.appendChild(element);
}

//Make the object with the question
function addQuestion(){
    let title = document.getElementById('input_title')
    let answers = document.getElementsByClassName('option')

    let question = {
        "title": title.value
    }

    if(!checkInput(title, answers)){
        alert("Faltan datos por completar")
        return;
    }

    for(let i=0; i<answers.length; i++){
        Object.defineProperty(question, `option${i+1}`, {
            value: answers[i].value,
            writable: true,
            enumerable: true,
            configurable: true,
        });
    }
    console.log(question);//TODO: Debug

    current_questions.push(question);
    current_answers.push(getAnswer())

    resetInputQuestion();
}

//Verify input of title and answers
function checkInput(title, answers){
    if(title.value === "") return false
    for(let i=0 ; i<answers.length; i++){
        if(answers[i].value === ""){
            return false
        }
    }

    return true;
}

//Return the correct answer of question
function getAnswer(){
    let ans;
    let radioButtons = document.getElementsByName('option');

    console.log(ans);

    for(let i=0 ; i<radioButtons.length ; i++){
        if(radioButtons[i].checked){
            ans = radioButtons[i].value;
        }
    }
    
    return ans;
}

//Clean the input 
function resetInputQuestion(){
    let question_container = document.getElementById('question');
    question_container.innerHTML = `
            <div><label for="input_title">Question</label><input type="text" id="input_title" placeholder="Question"></div>
            <div><label for="option1">Option 1</label><input type="text" placeholder="Option 1" id="option1" class="option"><input type="radio" name="option" value="option1" checked></div>
            <div><label for="option2">Option 2</label><input type="text" placeholder="Option 2" id="option2" class="option"><input type="radio" name="option" value="option2"></div>
            `
}

//Create the object Quiz with questions, answers and title
function generateQuiz(){
    let title = document.getElementById('input_title--quiz').value

    if(title === ""){
        alert("Falta un titulo para el examen")
        return
    }

    let newQuiz = {
        "title": title,
        "questions": [],
        "answers": []
    }

    for(let i=0; i<current_questions.length ; i++){
        newQuiz.questions.push(current_questions[i]);
        newQuiz.answers.push(current_answers[i]);
    }

    //Clean container
    let container = document.getElementById('container')
    current_quiz = {};
    current_questions = [];
    container.innerHTML = "";

    console.log(newQuiz)//TODO: Debug

    saveQuiz(newQuiz);
}

/* 
    Load quiz
*/
function loadQuiz(){
    let quizes = loadQuizesFromStorage();
    console.log(quizes);

    if(quizes == null){
        alert("Its void :c");
        return;
    }

    let container = document.getElementById('container')
    container.innerHTML = "";

    let selectList = createTestList(quizes);
    
    let button = document.createElement('button');
    button.onclick = takeTest;
    button.innerHTML = "Select";
    
    let testContainer = document.createElement('div');
    testContainer.id = "test-container";
    
    container.appendChild(selectList);
    container.appendChild(button);
    container.appendChild(testContainer);
}

function createTestList(quizes){
    //Create select elemnt and add options
    let select = document.createElement('select');
    select.id = "test-list";
    
    quizes.forEach(element => {
        let option = document.createElement('option');
        option.value = element.title;
        option.innerHTML = element.title;
        select.appendChild(option);
    });

    return select;
}

function takeTest(){
    let select = document.getElementById('test-list');
    let title = select.options[select.selectedIndex].value;
    alert(title);
    let quiz = loadQuizFromStorage(title);
}

/* 
    LOCAL STORAGE 
*/

//Save the new quiz in the local storage
function saveQuiz(quiz){
    if(localStorage.getItem('quizs') === null){
        let quizs = [];
        quizs.push(quiz);
        localStorage.setItem('quizs', JSON.stringify(quizs));
    }else{
        let quizs = JSON.parse(localStorage.getItem('quizs'));
        quizs.push(quiz);
        localStorage.setItem('quizs', JSON.stringify(quizs))
    }
}

function loadQuizesFromStorage(){
    let quizs = [];

    if(localStorage.getItem('quizs') === null){
        alert("Aun no hay ningun examen.");
    }else{
        quizs = JSON.parse(localStorage.getItem('quizs'));
    }

    return quizs;
}

function loadQuizFromStorage(title){
    if(localStorage.getItem('quizs') === null){
        alert("Aun no hay ningun examen.");
    }else{
        let quizs = JSON.parse(localStorage.getItem('quizs'));
        let currentQuiz = quizs.find(quiz => quiz.title == title)
        console.log(currentQuiz);
    }
}

function deleteQuizFromStorage(){

}
