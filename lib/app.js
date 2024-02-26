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
const store = require("connect-loki");
const LokiStore = store(session);
const {isAnyEmpty, exceedsMaxLength} = require("./validation");
app.set("views", "./views");
app.set("view engine", "pug");

app.use(morgan("common"));
app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in milliseconds
    path: "/",
    secure: false,
  },
  name: "launch-school-contacts-manager-session-id",
  resave: false,
  saveUninitialized: true,
  secret: "this is not very secure",
  store: new LokiStore({}),
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
function isNotUnique(userNameInput) {
    for (let i = 0; i < roster.roster.length; i += 1 ) {
        let user = roster.roster[i];
        if (user.userName === userNameInput){
            return true;
        }   
    }
    return false;
}
app.get("/", (req, res) => {
  res.redirect("/home");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/playlist", (req, res) => {
    res.render("playlist");
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
    }else if (isNotUnique(req.body.userName)){
        res.render("sign-up", {errorMessage: "User name is not already used"});
    }else { 
        roster.add(new User(req.body.firstName, req.body.lastName, req.body.userName, req.body.password));
         res.redirect("/playlist");
        console.log(roster.roster);
    }
   });
app.post("/playlist/sign-out", (req, res) => {
    //proccesses that sign out the user 
    res.redirect("/home");
});
app.post("/playlist/add", (req, res) => {
    res.render("add-song");
});
app.get("/users-roster", (req,res) => {
    res.render("users-roster")
})
app.post("/edit-song/upVote", (req,res) => {
    res.redirect("/playlist");
});
app.post("/edit-song/downVote", (req,res) => {
    res.redirect("/playlist");
});
app.post("/edit-song/play", (req,res) => {
    res.redirect("/playlist");
});
app.post("/edit-song/skip", (req,res) => {
    res.redirect("/playlist");
});
app.post("/edit-song/delete", (req,res) => {
    res.redirect("/playlist");
});
app.post("/add-song", (req,res) => {
    res.redirect("/playlist");
});
app.listen(port, host, () => {
  console.log(`App is listening on port ${port} of ${host}`);
});
