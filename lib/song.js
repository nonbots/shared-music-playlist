const Utilities = require("./utilities.js");
class Song{
    constructor(link, title, requestedBy){
        this.id = Utilities.getId(Song); 
        this.link = link;
        this.title = title;
        this.upVote= 0;
        this.downVote= 0;
        this.likeRating= 0;
        this.isCurSong = false;
        this.requestedBy = requestedBy;
    }
    static id = 0;
    static makeSong(dbSong) {
        return Object.assign(new Song(), dbSong);
    }
    setUpVote() {
        this.upVote += 1;//this.upVote = this.upVote + 1
        this.updateLikeRating();
    }
    setDownVote() {
        this.downVote += 1;
        this.updateLikeRating();
    }
    updateLikeRating(){
        this.likeRating = this.upVote - this.downVote;
    }
    setIsCurSong() {
                this.isCurSong ? this.isCurSong = false : this.isCurSong = true;
    }
}
module.exports = Song;

