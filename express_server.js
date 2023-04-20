///////////////settup//////////////////////////
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const bcrypt = require('bcryptjs')
const app = express();
const PORT = 8080;
const {generateRandomString, findUser, getUserURLs} = require('./functions')
app.set("view engine", "ejs");
app.listen(PORT, () => {
  console.log(`example app started on port: ${PORT}`);
});
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());
app.use(cookieSession({
  name: "session",
  keys: ['123', '456', '789']
}))


///////////////////notes///////////////////////
// currentUser variable read form cookie
//ngrok

///////////////Functions///////////////////////
// const generateRandomString = function() {
//   let string = "";
//   for (let i = 6; i > 0; i--) {
//     let setter = Math.floor(Math.random() * 3);
//     if (setter === 0) {
//       let charCodeIndex = Math.floor(Math.random() * (58 - 48) + 48);
//       string += String.fromCharCode(charCodeIndex);
//     }
//     if (setter === 1) {
//       let charCodeIndex = Math.floor(Math.random() * (91 - 65) + 65);
//       string += String.fromCharCode(charCodeIndex);

//     }
//     if (setter === 2) {
//       let charCodeIndex = Math.floor(Math.random() * (123 - 97) + 97);
//       string += String.fromCharCode(charCodeIndex);
//     }
//   }
//   return string;
// };

// const findUser = function(id, obj) {
//   for (const users in obj) {
//     if (obj[users].email === id) {
//       return obj[users];
//     }
//   }
//   return false;
// };

// const getUserURLs = function(user) {
//   const userURLs = {}
//   for (const id in urlDatabase ){
//     if (urlDatabase[id].userID === user) {
//       userURLs[id] = urlDatabase[id]    }
//   }
//   return userURLs
// }
///////////////objects///////////////////////

const urlDatabase = {
  "b2xVn2":{
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
    password: bcrypt.hashSync("admin",10)
  }

};
console.log(userDb)

//////////////////GET//////////////////////////

app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, user:  null };
  if (req.session.userid) {
    templateVars["user"] = userDb[req.session["userid"]];
    res.render("urls_new", templateVars);
  } 
    res.redirect(`/login`);
  });

app.get("/urls/:id", (req, res) => {
  const templateVars = { urls: urlDatabase, id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user:  null };
  if (req.session) {
    templateVars["user"] = userDb[req.session["userid"]];
  }
  if (req.session["userid"] !== urlDatabase[req.params.id].userID) {

    console.log ("Cookie user id", req.session["userid"] )
    console.log ("params id", req.params.id)
    res.status(400).send("This page belongs to another user")
  }
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, user: null };
  if (req.session.userid) {
    res.redirect(`/urls`);
  }
  res.render("register", templateVars);
});


app.get("/login", (req, res) => {
  const templateVars = { urls: urlDatabase, user:  null };
  if (req.session.userid) {
    res.redirect(`/urls`);
  }
  res.render("login", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  console.log(req.params)
  if (longURL) {    
    res.redirect(longURL);
  } else {
    console.log("doesnt exist")
    res.status(400).send("url not in database")

  }
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: getUserURLs(req.session["userid"], urlDatabase), user:  null };
  if (req.session) {
    templateVars["user"] = userDb[req.session["userid"]];
  } 
  res.render("urls_index", templateVars);
});


///////////////////POST////////////////////////

app.post("/urls/:id/delete", (req, res) => {
  if (req.session.userid) {
  delete urlDatabase[req.params.id];
  res.redirect(`/urls`);
  } else {
    res.status(400).send("Must be logged in to delete url's")
  }
});

app.post("/urls/:id/edit", (req, res) => {
  if (req.session.userid) {

  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect(`/urls`);
  } else {
    res.status(400).send("Must be logged in to edit url's")
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  let userid = findUser(email, userDb);
  if (userid === false) {

    res.status(403).send("User not yet registered");
  }
  if (!bcrypt.compareSync(password, userDb[userid.userId].password)) {
    res.status(403).send("incorrect password");
  }
  if (bcrypt.compareSync(password, userDb[userid.userId].password)) {
    req.session.userid = userid.userId;
    res.redirect("/urls");
  }
});

app.post("/urls", (req, res) => {
  if (req.session.userid) {

    let str = generateRandomString();
    urlDatabase[str] = {longURL: req.body.longURL,
    userID: req.session.userid}
    res.redirect(`urls/${str}`);
  } else {
    res.status(400).send("Must be logged in to add shorten url's")
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
    password: bcrypt.hashSync(password,10)
  };
  console.log(userDb)
  req.session.userid = userId;
  res.redirect("/urls");

})



