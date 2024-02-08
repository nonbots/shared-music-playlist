const express = require('express');
const morgan = require("morgan");
const app = express();
const host = "localhost";
const port = 3000;
const FS = require('fs');
app.set("views", "./views");
app.set("view engine", "pug");

app.use(morgan("common"));
app.use(express.static("public"));
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
    //processes the sign-up form
    //successful 
    res.redirect("/playlist");
    //not successful :highlight ctermfg=red guifg=red
    //display
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
