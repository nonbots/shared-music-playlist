class Playlist {

    constructor() {
        this.playlist = [];
    }
    getSongById(id) {
        return this.playlist.find(song => song.id === id);
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
module.exports = Playlist;
