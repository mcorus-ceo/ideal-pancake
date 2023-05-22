class User {
    constructor(name) {
        this.Name = name;
        this.QID = 0;
        this.Question = 0;
        this.Correct = 0;
        this.Wrong = 0;
        this.Questions = [];
    }
}

class Users {
    constructor() {
        this.Accounts = [];
        this.HelperDict = {}
    }

    KeyUpdate(Key) {
        this.Key = Key;
    }

    Sign(name, key) {
        if (key !== this.Key) 
            return 403;

        if (this.Accounts.includes(name))
            return 404;
        
        this.Accounts.push(new User(name));
        this.HelperDict[name] = this.Accounts.length - 1;
        //console.log(this.HelperDict, this.Accounts)
        
        return 200;
        
    }

    GetUserIndex(name) {
        return this.HelperDict[name] || 0;
    }
    
    GetUser(name) {
        return this.Accounts[this.GetUserIndex(name)]
    }

    IsSigned(name) {
        return this.Accounts.map(x=>x.Name).includes(name);
    }

    GetQID(name) {
        return this.GetUser(name);
    }

    AddQuestionIndex(name) {
        return this.GetUser(name).Question++
    }

    GetQuestionIndex(name) {
        console.log(`${name}: ${this.GetUser(name).Question}`)
        //console.log(this.HelperDict, this.Accounts)
        return this.GetUser(name);

    }

    AddCorrectAnswer(name) {
        this.GetUser(name).Correct++;
    }

    AddWrongAnswer(name) {
        this.GetUser(name).Wrong++;
    }

    Answer(name, data, fd) {
        this.GetUser(name).Questions.push(fd);
        if (fd.correct === true) this.AddCorrectAnswer(name)
        else this.AddWrongAnswer(name)
        //console.log(data)
        return;
    }

    ScoreBoard() {
        const scoreboard = require('./scoreboard');
        return new scoreboard(this)
    }
}

exports.User = User;
exports.UsersConstructor = Users;