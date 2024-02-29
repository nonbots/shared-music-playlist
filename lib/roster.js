class Roster {
    constructor() {
        this.roster = [];
    }
    add(user){
        this.roster.push(user);
   }
    getUserByName(userName) {
        for (let i = 0; i < this.roster.length; i += 1) {
            if(this.roster[i].userName === userName) return this.roster[i];
    }
    }
}
module.exports = Roster;
