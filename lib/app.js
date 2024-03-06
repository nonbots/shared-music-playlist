const express = require('express');
const morgan = require("morgan");
const app = express();
const host = "localhost";
const port = 3000;
const FS = require('fs');
const session = require("express-session");
const User = require("./user.js");
const Roster = require("./roster.js");
const roster = new Roster();
const Song = require("./song.js");
const Playlist = require("./playlist.js");
//const playlist = new Playlist();
const store = require("connect-loki");
const LokiStore = store(session);
const {isAnyEmpty, exceedsMaxLength} = require("./validation");

app.set("views", "./views");
app.set("view engine", "pug");

app.use(morgan("common"));
app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 91 * 24 * 60 * 60 * 1000, // 31 days in milliseconds
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
    if("playlist" in req.session) {
        req.session.playlist.forEach(song => {
            newPlaylist.push(Song.makeSong(song));
        });
    }
    req.session.playlist = newPlaylist;
    next();
});
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.redirect("/home");
});
app.get("/login", (req, res) =>  {
    res.render("login");
});
app.post("/login", (req, res) => {
    if (isAnyEmpty(req.body)) {
        res.render("login", {errorMessage: "An input field or more is empty"});
    }else if (roster.isInvalidLogin(req.body.userName, req.body.password)) {
        res.render("login", {errorMessage: "Invalid username and/or password"});
    }else {
        let userLogin = roster.getUserByName(req.body.userName);
        req.session.user = userLogin;
        res.redirect("/playlist");
    } 
});
app.get("/playlist", (req, res) => {
    // pass all video ids in playlist to iframe 
    console.log("IN PLAYLIST ROUTE", req.session.playlist);
   let videoIds = Playlist.getVideoIds(req.session.playlist);
    console.log("THIS IS THE VIDEOIDS", videoIds);
    res.render("playlist", {userLogin: req.session.user, playlist: req.session.playlist, videoId: req.session.videoId, videoIds: videoIds});
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
        res.render("sign-up", {errorMessage: "An input field or more is empty"});
    } else if(exceedsMaxLength(req.body)) {
        res.render("sign-up", {errorMessage: "An input field or more exceeds 20 characters in length"});
    }else if (roster.isNotUnique(req.body.userName)){
        res.render("sign-up", {errorMessage: "User name is already used"});
    }else { 
        let user = new User(req.body.firstName, req.body.lastName, req.body.userName, req.body.password);
        roster.add(user);
        let userLogin = roster.getUserByName(req.body.userName);
        req.session.user = userLogin;
        res.redirect("/playlist");
    }
   });
app.post("/playlist/sign-out", (req, res) => {
    res.redirect("/home");
});
app.post("/playlist/add", async (req, res) => {
    console.log(req.body);
    console.log("inside the playlist add route");
    if (isAnyEmpty(req.body)) {
        res.render("add-song", {errorMessage: "Input Field is empty"});
    }else{
        let title;
      try {
        const response = await fetch(req.body.link);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`); // Provide more specific error message
        }

        const body = await response.text();
        title = /<title>(.*?)<\/title>/.exec(body)[1];

      } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw the error for further handling if needed
      }
        console.log(req.body.link, "THIS IS THE URL FROM BODY");
        let song = new Song(req.body.link, title, req.session.user.userName);
        console.log(req.session.playlist, "THIS IS THE ARRAY OF SONGS IN THE ARRAY IN THE SESSION");
       req.session.playlist.push(song);
        console.log(req.session.playlist, "THIS IS THE ARRAY OF SONGS IN THE ARRAY IN THE SESSION");
 
        console.log("THIS IS THE ADDED SONG", song);
       res.redirect("/playlist");
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
    res.render("users-roster")
});
app.post("/edit-song/upVote", (req,res) => {
    res.redirect("/playlist");
});
app.post("/edit-song/downVote", (req,res) => {
    res.redirect("/playlist");
});
app.get("/playlist/edit-song/play/:songId", (req,res) => {
    let songId = Number( req.params.songId);    
    let song = Playlist.getSongById(req.session.playlist,songId);
    req.session.videoId = song.link.split('=')[1];
    res.redirect("/playlist");
});
app.post("/edit-song/skip", (req,res) => {
    res.redirect("/playlist");
});
app.post("/playlist/edit-song/delete/:songId", (req,res) => {
    let songId = Number(req.params.songId);
   for (let i = 0; i < req.session.playlist.length; i += 1) {
       if( req.session.playlist[i].id === songId) {
           req.session.playlist.splice(i, 1);
           break;
        }
   }
    res.redirect("/playlist");
});

app.listen(port, host, () => {
  console.log(`App is listening on port ${port} of ${host}`);
});
