const Utilities = require("./utilities.js");
class Song {
  constructor(link, title, videoId, duration, requestedBy, ms) {
    this.id = Utilities.getId(Song);
    this.link = link;
    this.title = title;
    this.videoId = videoId;
    this.duration = duration;
    this.upVote = 0;
    this.downVote = 0;
    this.likeRating = 0;
    this.isCurSong = false;
    this.requestedBy = requestedBy;
    this.ms = ms;
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
    updateLikeRating() {
      this.likeRating = this.upVote - this.downVote;
    }
    toggleCurSong() {
      this.isCurSong ? this.isCurSong = false : this.isCurSong = true;
    }
    parseURL() {
      if (this.link.includes("youtu.be")) {
        let parsed = this.link.split('?')[0];
        let parsed2 = parsed.split('/');
        return parsed2[parsed2.length - 1];
      }
      let stringQuery = this.link.split("?")[1];
      let params = stringQuery.split("&");
      let videoIdParam = this.getVideoIdParams(params);
      return videoIdParam.substring(2);

    }
    getVideoIdParams(params) {
      for (let i = 0; i < params.length; i += 1) {
        let param = params[i];
        if (param.includes('v=')) return params[i];
      }
    }

}
module.exports = Song;

