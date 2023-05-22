class Scoreboard {
    constructor(input) {
        const accounts = input.Accounts;
        
        this.HighestWidth = 0;
        for (const account of accounts) {
            if (account.Question > this.HighestWidth) this.HighestWidth = account.Question;
            else continue;
        } 
        this.ReturnData = {
            MaxWidth: this.HighestWidth,
            Users: accounts.map(x => {
                return {
                    name: x.Name,
                    filled: x.Correct,
                    empty_array: Array.apply(null, Array(x.Correct)).map(function () {return 0}),
                    wrong_array: Array.apply(null, Array(x.Wrong)).map(function () {return 0}) || []
                }
            }).sort((a,b)=> a.filled > b.filled)
            
        }
        /**
         * {
                MaxWidth: 2,
                Users: [ { name: 'P', filled: 2 }, { name: 'D', filled: 2 } ]
            }
         */
        //console.log(this.ReturnData, accounts)
        return this.ReturnData;

    }    
}

module.exports = Scoreboard;


/**
 * {
    "Accounts": [
        {
            "Name": "Timmy123",
            "QID": 0,
            "Question": 2,
            "Correct": 1,
            "Wrong": 1,
            "Questions": [
                {
                    "text": "A2 Y",
                    "correct": true,
                    "index": 1
                },
                {
                    "text": "A1 Y",
                    "correct": false,
                    "index": 0
                }
            ]
        },
        {
            "Name": "Sir lord high timothty",
            "QID": 0,
            "Question": 2,
            "Correct": 0,
            "Wrong": 2,
            "Questions": [
                {
                    "text": "A1",
                    "correct": false,
                    "index": 0
                },
                {
                    "text": "A2",
                    "correct": false,
                    "index": 1
                }
            ]
        }
    ],
    "HelperDict": {
        "Timmy123": 0,
        "Sir lord high timothty": 1
    },
    "Key": "1"
}
 */