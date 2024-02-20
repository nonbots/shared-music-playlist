const Song = require("./song.js");
const User = require("./user.js");
class Playlist {

    constructor() {
        this.playlist = [];
    }
    add(song) {
        this.playlist.push(song);
    }
    skip() {
        let curSongPosition = this.playlist.indexOf(this.getCurSong());
        if (curSongPosition === this.playlist.length - 1) {
            return this.playlist[0];
        } else {
             return this.playlist[curSongPosition + 1];
        }
    }
    getCurSong() {
        for (let i = 0; i < this.playlist.length; i += 1) {
            let curSong = this.playlist[i];
            if (curSong.isCurSong) {
                return curSong;
            }
        }
    }
    remove(song) {
        let songPosition = this.playlist.indexOf(song);
        this.playlist.splice(songPosition, 1);
    }
} 
let pl = new Playlist();
let song1 = new Song("link1");
let song2 = new Song("link2");
console.log(song1);
console.log(song2);
let user1 = new User('nhan', 'bot', 'naan','bread');
let user2 = new User('Bob', 'bear', 'band', 'star');
console.log(user1);
console.log(user2);
