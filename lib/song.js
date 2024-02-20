const Utilities = require("./utilities.js");
class Song{
    constructor(link){
        this.id = Utilities.getId(Song); 
        this.link = link;
        this.title = "this is the title"  // look at google api to fetch the title of the video 
        this.upVote= 0;
        this.downVote= 0;
        this.likeRating= 0;
        this.isCurSong = false;
    }
    static id = 0;
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

