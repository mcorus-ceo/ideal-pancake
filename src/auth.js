class Access {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    Check(req, res) {
        let {username, password} = req.body;
        if (username !== this.username || password !== this.password) 
            return false;

        return true;
        
    }
}

exports.Access = Access;