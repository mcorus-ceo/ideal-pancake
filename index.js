const express = require("express");
const app = express();
const fs = require("fs")
const {Access} = require('./src/auth.js');
const {UsersConstructor} = require('./src/user.js')
 
app.engine('html', require('ejs').renderFile);
app.use('/public',express.static('public'));
app.use(express.json());

let adminFile = require('./admin.json')
let quizFile = require('./quizzes.json');

const auth = new Access(adminFile.username, adminFile.password)
let Users = new UsersConstructor();
Users.KeyUpdate(quizFile.key)

app.get('/', (req,res) => {
    res.render('index.html');
})
app.post('/login', (req,res)=> {
    if (!auth.Check(req))
        return accessDenied(res)


    
    return res.status(200).json({
        code: 200,
        error: 'Successful login'
    })
})

app.post('/quizzes', (req,res) => {
    if (!auth.Check(req))
        return accessDenied(res)
    
    return res.status(200).json({
        code:200,
        quizzes:
            Object.keys(quizFile).filter(x=>x!=='active'),
        active: quizFile['active']
    })
})
app.post('/saveactivecode', (req,res)=> {
    if (!auth.Check(req))
        return accessDenied(res)

    if (req.body.ws) quizFile.key = req.body.ws;
    fs.writeFileSync("quizzes.json",JSON.stringify(quizFile,null, 4))
    
    Users.KeyUpdate(req.body.ws);

    return res.status(200)
})

app.get('/quiz', (req,res)=>{
    const name = req.query.name;
    if (!Users.IsSigned(name)) return res.status(403).redirect('/')

    const qi = Users.GetQuestionIndex(name).Question
    const qa = quizFile[quizFile.active][qi]
    const qa2 = quizFile[quizFile.active]
    /*console.log({
        qi,
        qa2,
    })*/

    if (qi >= qa2.length) return res.status(200).render('score.ejs', {
        name,
        users: Users,
        board: Users.ScoreBoard(),
    })

    console.log(qa)

    const question = qa.name
    let i = 0;
    const answers = qa.answers.map(function (x) {
        x = {...x, index: i}
        x.correct = null;

        i++;
        return x;
    })

    const data = {
        question,
        answers,
        ...req.query,
    }

    res.status(200).render('quiz.ejs', data)
})

app.post('/answer', (req,res) => {
    const name = req.body.name;
    console.log(name)
    if (!Users.IsSigned(name)) return res.status(403).redirect('/')
    const qi = Users.GetQuestionIndex(name).Question
    const qa = quizFile[quizFile.active][qi];


    const incq = req.body.question
    let i = 0;
    const answers = qa.answers.map(function (x) {
        x = {...x, index: i}

        i++;
        return x;
    })
    const corrAns = answers[incq.index]
    Users.Answer(name, incq, corrAns)
    Users.AddQuestionIndex(name);
    console.log(corrAns)
    return res.status(200).json({
        correct: corrAns.correct
    })


    
    
})

app.post('/join', (req,res)=>{
    const name = req.body.name;
    const key = req.body.key;

    const status = Users.Sign(name,key);

    switch (status) {
        case 403:
            res.status(403).json({
                code: 403,
                error: 'Incorrect key!'
            })
            break;
        case 404:
            res.status(418).json({
                code: 418,
                error: 'Name in use!'
            })
            break;
        case 200:
            res.status(200).json({
                code:200,
            })
            break;
        default:
            res.status(500).json({
                code: 500,
                error: 'Something went severly wrong'
            })
    }
})

app.post('/getactivecode', (req,res)=>{
    if (!auth.Check(req))
        return accessDenied(res)

    

    res.status(200).json({
        key: quizFile.key
    })
})

app.post('/activequiz', (req,res)=>{
    const quiz = req.body.quiz;
    if (!auth.Check(req))
        return accessDenied(res)

    if (!quizFile[quiz]) 
        return res.status(404);
    
    quizFile.active = quiz;
    
    fs.writeFileSync("quizzes.json",JSON.stringify(quizFile,null, 4))   
    
    Users = {};
    Users = new UsersConstructor();
    Users.KeyUpdate(quizFile.key)
})
app.post('/newquiz', (req,res)=>{
    let username = req.body.username
    let password = req.body.password
    let quiz = req.body.quiz
    console.log(quiz)

    let quizName = quiz.quizName
    let quizQuestions = quiz.questions

    if (!auth.Check(req))
        return accessDenied(res)

    
    quizFile[recursiveQuizFileCheck(quizName)] = quizQuestions;

    fs.writeFileSync("quizzes.json",JSON.stringify(quizFile,null, 4))
})

app.get('/admin', (req,res)=>{
  res.render('admin.html')  
})
app.listen(3040, ()=> {
    console.log("listening on port 3040")
})

function accessDenied(res) {
    return res.status(403).json({
        code:403,
        error:'Incorrect username/password'
    })
}
function recursiveQuizFileCheck(name, count=1) {
    if ((quizFile[name] && count===1) || quizFile[name + "-" + "count"]) {
        if (quizFile[name + "-" + count]) {
            recursiveQuizFileCheck(name, data, count+1)
        } else {
            return name + "-" + count
        }
    }

    return name
}