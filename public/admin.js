const urlParams = new URLSearchParams(window.location.search);
let URL = document.location.origin;
let username = urlParams.get('username')
let password = urlParams.get('password')
let globalQuizzes = []

fetch(`${URL}/quizzes`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username,
        password
    })
}).then(res=>res.json()).then(data=>{
    switch (data.code) {
        case 403:
            document.location.href=`${URL}`
            break;
        case 200:
            populateQuizzesDropdown(data.quizzes, data.active);
            getQuizCode()
            break;
        default:
            break;
    }
})

const populateQuizzesDropdown = (quizzes,active) => {
    globalQuizzes = quizzes
    let quizDropdown = document.querySelector('#current_quiz')
    for (quizIndex in quizzes) {
        let quiz = quizzes[quizIndex]
        let quizEl = document.createElement("option")
        quizEl.setAttribute('data-index', quizIndex)
        quizEl.value = quiz
        quizEl.innerHTML = quiz
        if (quiz === active) quizEl.selected = true;
        console.log(quizEl)
        quizDropdown.appendChild(quizEl)
    }

}

document.querySelector("#newQuizBtn").addEventListener("click", function (e) {
    var optionsEl = document.querySelector("#newQuizOptions")
    optionsEl.style = ''
})
document.querySelector('#current_quiz').addEventListener('change', function(e) {
    hideQuizInputs();
    fetch(`${URL}/activequiz`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
            quiz: e.target.value,
        })
    })
})

function hideQuizInputs() {
    document.querySelector("#newQuizOptions").style = 
        "display:none;position:absolute;bottom:-1000px;left:-1000px"

    document.querySelectorAll(".quizInput").forEach(e=>{
        let placeholder = e.getAttribute("placeholder")
        if (placeholder)
            e.value = placeholder
        else
            e.checked = false
    })
}

let qI = 0;

function newAnswer(qIndex) {
    let pa = document.querySelectorAll(".quizQuestionQuestions")
    let pe = pa[qIndex];
    
    if (!pe) return;
    let ne = document.createElement("div")
    ne.classList.add("quizQuestion", "Answer")
    ne.innerHTML = `<input type="text" class="invisinput quizQuestionName quizInput" placeholder="New Answer" value="New Answer">
                    
    <br>
    
    <label for="correctAnswer">Correct Answer</label>
    <input type="checkbox" name="correctAnswer" class="quizQuestionCorrect quizInput">`
    pe.appendChild(ne)
}

document.querySelector("#addNewQuizQuestion").addEventListener("click", e => {
    qI++;
    let parent = document.querySelector("#newQuizQuestions")
    let newE = document.createElement("div")
    newE.classList.add("newQuestion")
    newE.innerHTML=`<input class="invisinput quizInput quizQuestionQuestion" placeholder="New Question" value="New Question">
          
    <div class="quizQuestionQuestions">
        <div class="quizQuestionQuestionsAnswer">
            <input type="text" class="invisinput quizQuestionName quizInput" placeholder="New Answer" value="New Answer">

            <br>
            
            <label for="correctAnswer">Correct Answer</label>
            <input type="checkbox" name="correctAnswer" class="quizQuestionCorrect quizInput">
        </div>
    </div>
    <button class="addAnswer btn" data-index="${qI}" onclick="newAnswer(${qI})">Add new Answer</button>
    `
    parent.appendChild(newE)
})

document.querySelector("#addQuizBtn").addEventListener('click', function (e) {
    let questionsAll = document.querySelectorAll(".newQuestion")
    let questions = []
    for (i in questionsAll) {
        let question = questionsAll[i]
        if (!question.firstElementChild) continue
        let qName = question.firstElementChild.value;
        let qaChildren = question.children[1].children
        console.log(questionsAll, question, qaChildren)
        let answers = [];
        
        let tempA1 = {
            text: qaChildren[0].value || qaChildren[0].placeholder,
        }
        try {
            tempA1.correct= qaChildren[3].checked || false;
        } catch {
            tempA1.correct = qaChildren[0].children[3].checked;
        }
        answers.push(tempA1)

        for (let answer of Array.from(qaChildren).filter(x=>x.nodeName === 'DIV')) {
            let pushed = {
                text: answer.firstElementChild.value || answer.firstChild.placeholder,
                correct: answer.lastChild.checked || false,
                el: answer,
            }
            console.log(answer, pushed)
            answers.push(pushed)
        }
        answers = answers.filter(x=>x.el && x.text);
        answers.forEach(x=>{

            if (!x.text) x.text = 'New Answer'
            delete x.el
        })
        //debugger;
        questions.push({
            name: qName || "New Questions",
            answers,
        })

    }
    console.log(questions)
    fetch(`${URL}/newquiz`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
            quiz: {
                quizName: document.querySelector("#newQuizName").value,
                questions
            }
        })
    })

    document.location.reload()

})
function generateQuizCode() {
    const wl = words({exactly:4, maxLength:5});
    let ws = wl.join("-")
    const input = document.querySelector('[name="quizCode"]')
    input.value = ws;
}
function saveQuizCode() {
    const input = document.querySelector('[name="quizCode"]')
    if (!input.value) return;
    let ws = input.value;
    fetch(`${URL}/saveactivecode`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
            ws,
        })
    })
}

function getQuizCode() {
    const input = document.querySelector('[name="quizCode"]')
    fetch(`${URL}/getactivecode`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
        })
    }).then(res=>res.json()).then(data=>{
        console.log(data)
        input.value = data.key;
    })
}