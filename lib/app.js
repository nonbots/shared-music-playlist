const MSG = require("./msg.json");
const express = require('express');
const morgan = require("morgan");
const app = express();
const host = "localhost";
const port = 3000;
const session = require("express-session");
const User = require("./user.js");
const Roster = require("./roster.js");
const roster = new Roster();
const Song = require("./song.js");
const Playlist = require("./playlist.js");
const store = require("connect-loki");
const LokiStore = store(session);
const {isAnyEmpty, exceedsMaxLength, isNotUnique} = require("./validation");
const bodyParser = require('body-parser');

app.set("views", "./views");
app.set("view engine", "pug");

app.use(morgan("common"));
app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 91 * 24 * 60 * 60 * 1000,
    path: "/",
    secure: false,
  },
  name: "music-playlist-id",
  resave: false,
  saveUninitialized: true,
  secret: "this is not very secure",
  store: new LokiStore({}),
}));
app.use((req,res, next) => {
  let newPlaylist = [];
  if ("playlist" in req.session) {
    req.session.playlist.forEach(song => {
      newPlaylist.push(Song.makeSong(song));
    });
  }
  if (!("curVideoId" in req.session)) {
    req.session.curVideoId = req.session.playlist[0].videoId;
  }
  req.session.playlist = newPlaylist;
  next();
});
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.text());
function resetCurSong(playlist) {
  playlist.forEach(song => song.isCurSong = false);
}
app.get("/", (req, res) => {
  res.redirect("/home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  if (isAnyEmpty(req.body)) {
    res.render("login", {errorMessage: `${MSG.isEmpty}`});
  } else if (roster.isInvalidLogin(req.body.userName, req.body.password)) {
    res.render("login", {errorMessage: `${MSG.invalidLogin}`});
  } else {
    let userLogin = roster.getUserByName(req.body.userName);
    req.session.user = userLogin;
    res.redirect("/playlist");
  }
});
app.get("/add-song", (req, res) => {
  res.render("add-song");
});
app.get("/edit-song", (req, res) => {
  res.render("edit-song");
});
app.get("/sign-up", (req, res) => {
  res.render("sign-up");
});
app.get("/home", (req, res) => {
  res.render("home");
});
app.post("/sign-up", (req,res) => {
  if (isAnyEmpty(req.body)) {
    res.render("sign-up", {errorMessage: `${MSG.isEmpty}`});
  } else if (exceedsMaxLength(req.body)) {
    res.render("sign-up", {errorMessage: `${MSG.exceeds}`});
  } else if (roster.isNotUnique(req.body.userName)) {
    res.render("sign-up", {errorMessage: `${MSG.userNotUnique}`});
  } else {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let userName = req.body.userName;
    let password = req.body.password;
    let user = new User(firstName, lastName, userName, password);
    roster.add(user);
    let userLogin = roster.getUserByName(userName);
    req.session.user = userLogin;
    res.redirect("/playlist");
  }
});
app.post("/playlist/sign-out", (req, res) => {
  res.redirect("/home");
});
app.post("/playlist/add", async (req, res) => {
  if (isAnyEmpty(req.body)) {
    req.session.errorMessage = `${MSG.isEmpty}`,
    res.redirect("/playlist");
  } else {
    let category;
    let title;
    let videoId;
    let duration;
    try {
      const response = await fetch(req.body.link);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      const body = await response.text();
      //console.log("YT BODY", body);
      title = /<title>(.*?) - YouTube/.exec(body)[1];
      videoId = /\?v=([^"]+)/.exec(body)[1];
      category = /"category":"(.*?)"/.exec(body)[1];
      console.log(/"approxDurationMs":"(.*?)"/.exec(body), "THIS IS THE DURATION");
      let totalMilli = /"approxDurationMs":"(.*?)"/.exec(body)[1];
      duration = Song.getDuration(totalMilli);
      console.log(title, videoId, category, totalMilli);
    } catch (error) {
      console.error('Error:', error);
      throw error; // Re-throw the error for further handling if needed
    }
    /*if(category !== "Music" && !category.includes("Film")) {
      req.session.errorMessage = `${MSG.isNotMusic}`;
      res.redirect("/playlist");
    }*/
    if (isNotUnique(videoId,req.session.playlist)) {
      req.session.errorMessage = `${MSG.songNotUnique}`
      res.redirect("/playlist");
    } else {
      let song = new Song(req.body.link, title, videoId, duration, req.session.user.userName);
      req.session.playlist.push(song);
      delete req.session.errorMessage;
      res.redirect("/playlist");
    }
  }
});
app.get("/playlist/edit-song/:songId", (req, res) => {
  let songId = Number( req.params.songId);
  let song = Playlist.getSongById(req.session.playlist, songId);
  res.render("edit-song", {song: song});
});
app.get("/playlist/add", (req,res) => {
  res.render ("add-song");
});
app.get("/users-roster", (req,res) => {
  res.render("users-roster");
});
app.post("/edit-song/upVote", (req,res) => {
  res.redirect("/playlist");
});
app.post("/edit-song/downVote", (req,res) => {
  res.redirect("/playlist");
});
app.post('/videoFinished', (req, res) => {
  let videoId = `${req.body}`;
  console.log(`${videoId} has finished playing`);
  req.session.playlist[0].isCurSong = false;
  let songRemoved = req.session.playlist.shift();
  req.session.playlist.push(songRemoved);
  req.session.playlist[0].isCurSong = true;
  req.session.curVideoId = req.session.playlist[0].videoId;
  res.redirect("/playlist");
});
app.get("/playlist/edit-song/play/:songId", (req,res) => {
  let songId = Number( req.params.songId);
  //resetCurSong(req.session.playlist);
  let song = Playlist.getSongById(req.session.playlist,songId);
  let curSong = Playlist.getSongByVideoId(req.session.playlist, req.session.curVideoId);
  if (!curSong) curSong = song;
  curSong.isCurSong = false;
  req.session.curVideoId = song.videoId;
  song.isCurSong = true;
  let songIdx = req.session.playlist.indexOf(song);
  let topHalf = req.session.playlist.splice(0, songIdx);
  req.session.playlist = req.session.playlist.concat(topHalf);
  req.session.videoId = song.videoId;
  res.redirect("/playlist");
});
app.get("/playlist", (req, res) => {
  let videoIds = Playlist.getVideoIds(req.session.playlist);
  res.render("playlist", {
    errorMessage: req.session.errorMessage,
    userLogin: req.session.user,
    playlist: req.session.playlist,
    videoId: req.session.videoId,
    videoIds: videoIds
  });
});

app.post("/edit-song/skip", (req,res) => {
  res.redirect("/playlist");
});
app.post("/playlist/edit-song/delete/:songId", (req,res) => {
  let songId = Number(req.params.songId);
  for (let idx = 0; idx < req.session.playlist.length; idx += 1) {
    if ( req.session.playlist[idx].id === songId) {
      req.session.playlist.splice(idx, 1);
      break;
    }
  }
  res.redirect("/playlist");
});

app.listen(port, host, () => {
  console.log(`App is listening on port ${port} of ${host}`);
});

