///////////////set-tup//////////////////////////
const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const methodOverride = require('method-override')
const app = express();
const PORT = 8080;
const { generateRandomString, findUser, getUserURLs } = require('./functions');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ['123', '456', '789']
}));
app.use(methodOverride('_method'))
app.listen(PORT, () => {
  console.log(`example app started on port: ${PORT}`);
});


///////////////////notes///////////////////////
// currentUser variable read form cookie
//ngrok


///////////////objects///////////////////////

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "admin1"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "admin1"
  }
};
const userDb = {
  admin1: {
    userId: "admin1",
    email: "admin@admin.com",
    password: bcrypt.hashSync("admin", 10)
  }
};

//////////////////GET_REQUESTS//////////////////////////

app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, user: null };
  if (req.session.userid) {
    templateVars["user"] = userDb[req.session["userid"]];
    return res.render("urls_new", templateVars);
  }
  res.redirect(`/login`);
});

app.get("/urls/:id", (req, res) => {
  if (urlDatabase[req.params.id] === undefined) {

    return res.status(400).send("URL not in database");
  }
  const templateVars = { urls: urlDatabase, id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: null };
  if (req.session) {
    templateVars["user"] = userDb[req.session["userid"]];
  }
  if (req.session["userid"] !== urlDatabase[req.params.id].userID) {

    return res.status(400).send("This page belongs to another user");
  }
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, user: null };
  if (req.session.userid) {
    return res.redirect(`/urls`);
  }
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { urls: urlDatabase, user: null };
  if (req.session.userid) {
    return res.redirect(`/urls`);
  }
  res.render("login", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(400).send("url not in database");

  }
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: getUserURLs(req.session["userid"], urlDatabase), user: null };
  if (req.session) {
    templateVars["user"] = userDb[req.session["userid"]];
  }
  res.render("urls_index", templateVars);
});

///////////////////POST_REQUESTS////////////////////////

app.delete("/urls/:id", (req, res) => {
  if (req.session.userid) {
    delete urlDatabase[req.params.id];
    res.redirect(`/urls`);
  } else {
    res.status(400).send("Must be logged in to delete url's");
  }
});

app.put("/urls/:id", (req, res) => {
  if (req.session.userid) {

    urlDatabase[req.params.id].longURL = req.body.longURL;
    res.redirect(`/urls`);
  } else {
    res.status(400).send("Must be logged in to edit url's");
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  let userid = findUser(email, userDb);
  if (userid === false) {

    res.status(403).send("User not yet registered");

  } else {

    if (!bcrypt.compareSync(password, userDb[userid.userId].password)) {
      res.status(403).send("incorrect password");
    }
    if (bcrypt.compareSync(password, userDb[userid.userId].password)) {
      req.session.userid = userid.userId;
      res.redirect("/urls");
    }
  }
});

app.post("/urls", (req, res) => {
  if (req.session.userid) {

    let str = generateRandomString();
    urlDatabase[str] = {
      longURL: req.body.longURL,
      userID: req.session.userid
    };
    res.redirect(`urls/${str}`);
  } else {
    res.status(400).send("Must be logged in to add shorten url's");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/login");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("please enter email and password");
  }
  if (findUser(email, userDb)) {
    res.status(400).send("User already exists");
  }

  const userId = generateRandomString();
  userDb[userId] = {
    userId: userId,
    email,
    password: bcrypt.hashSync(password, 10)
  };
  req.session.userid = userId;
  res.redirect("/urls");

})



