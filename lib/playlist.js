const Song = require("./song.js");
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
song2.setIsCurSong();
pl.add(song1);
pl.add(song2);
console.log(pl.playlist);
console.log(pl.skip());
pl.remove(song2);
console.log(pl);
