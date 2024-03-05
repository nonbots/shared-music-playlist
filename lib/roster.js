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
    isInvalidLogin(userNameInput, passwordInput) {
        for (let i = 0; i < this.roster.length; i += 1) {
            let user = this.roster[i];
            if (user.isPassword(passwordInput) && user.isUserName(userNameInput)) {
                return false
            }
        }
        return true;
    }
    isNotUnique(userNameInput) {
        for (let i = 0; i < this.roster.length; i += 1 ) {
            let user = this.roster[i];
            if (user.isUserName(userNameInput)) {
                return true;
            }
        }
        return false;
    }


}
module.exports = Roster;
