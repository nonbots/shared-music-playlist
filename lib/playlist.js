class Playlist {

  //constructor() {
  //    this.playlist = [];
  //}

  static getSongById(playlist,id) {
    return playlist.find(song => song.id === id);
  }
    static getSongByVideoId(playlist,videoId) {
    return playlist.find(song => song.videoId === videoId);
  }
  static add(playlist,song) {
    playlist.push(song);
  }
  static skip(playlist) {
    let curSongPosition = playlist.indexOf(Playlist.getCurSong(playlist));
    if (curSongPosition === playlist.length - 1) {
      return playlist[0];
    } else {
      return playlist[curSongPosition + 1];
    }
  }
  static getCurSong(playlist) {
    return playlist.find(song => song.isCurSong);
  }
  static remove(playlist,song) {
    let songPosition = playlist.indexOf(song);
    playlist.splice(songPosition, 1);
  }
  static getVideoIds(playlist) {
    return playlist.map(song => song.videoId);
  }
}
module.exports = Playlist;
