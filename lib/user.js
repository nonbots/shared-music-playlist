const Utilities = require("./utilities.js");
class User{
    constructor(first, last, userName, password){
        this.first = first;
        this.last = last;
        this.password = password;
        this.userName = userName;
        this.id = Utilities.getId(User);
        this.requestedSongs = 0;
        this.deletedSongs = 0;
    }
    static id = 0; 
    signIn(){}
    signOut(){}
}

module.exports = User;
