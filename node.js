// Setting up modules
const fs = require("fs")
const path = require("path");

const express = require("express");
const app = express();
const basicAuth = require('express-basic-auth');
const handlebars = require("express-handlebars");

const NoteService = require("./service/noteService")
const NoteRouter = require("./router/noteRouter");
const AuthChallenger = require("./AuthChallenger");
const config = require("./storage/config.json")["development"];

// Set up front end
app.engine("handlebars", handlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Setting up middleware

app.use(express.urlencoded({
    extended: false
}))
app.use(express.json())

app.use(express.static("public"));

// Set up basic auth
app.use(
    basicAuth({
      authorizer: AuthChallenger(
        JSON.parse(fs.readFileSync(path.join(__dirname, config.users)))
      ), // we are defining the file where our users exist with this code: JSON.parse(fs.readFileSync(path.join(__dirname, config.users))), we also parse the data so that we can iterate over each user like a JavaScript variable/ object.
      challenge: true,
      realm: "Note Taking Application",
    })
  );

//Create note
const noteService = new NoteService(__dirname + "/storage/notes.json")

// Responsible for sending our index page back to our user.
app.get("/", (req, res) => {
    console.log(req.auth.user, req.auth.password);
    noteService.list(req.auth.user).then((data) => {
      console.log(data);
      res.render("index", {
        user: req.auth.user,
        notes: data,
      });
    });
  });

// //Connect to noteService router
app.use("/api/notes", new NoteRouter(noteService).router());

//Setup server
app.listen(3000, function () {
    console.log("Running on port 3000")
})

module.exports = app