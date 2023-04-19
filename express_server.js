///////////////settup//////////////////////////
const express = require('express');
var cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const PORT = 8080;
//const generateRandomString = require('./generator')
app.set("view engine", "ejs");
app.listen(PORT, () => {
  console.log(`example app started on port: ${PORT}`);
});
app.use(express.urlencoded({ extended: true }));


///////////////////notes///////////////////////
// currentUser variable read form cookie

///////////////Functions///////////////////////
const generateRandomString = function() {
  let string = "";
  for (let i = 6; i > 0; i--) {
    let setter = Math.floor(Math.random() * 3);
    if (setter === 0) {
      let charCodeIndex = Math.floor(Math.random() * (58 - 48) + 48);
      string += String.fromCharCode(charCodeIndex);
    }
    if (setter === 1) {
      let charCodeIndex = Math.floor(Math.random() * (91 - 65) + 65);
      string += String.fromCharCode(charCodeIndex);

    }
    if (setter === 2) {
      let charCodeIndex = Math.floor(Math.random() * (123 - 97) + 97);
      string += String.fromCharCode(charCodeIndex);
    }
  }
  return string;
};
///////////////objects///////////////////////

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const userDb = {

};


//////////////////GET//////////////////////////

app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase };
  if (req.cookies) {
    templateVars["user"] = userDb[req.cookies["userid"]];
  } else {
    templateVars["user"] = null;
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { urls: urlDatabase, id: req.params.id, longURL: urlDatabase[req.params.id]  };
  if (req.cookies) {
    templateVars["user"] = userDb[req.cookies["userid"]];
  } else {
    templateVars["user"] = null;
  }
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase };
  if (req.cookies) {
    templateVars["user"] = userDb[req.cookies["userid"]];
  } else {
    templateVars["user"] = null;
  }
  res.render("register", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  if (req.cookies) {
    templateVars["user"] = userDb[req.cookies["userid"]];
  } else {
    templateVars["user"] = null;
  }
  res.render("urls_index", templateVars);
});


///////////////////POST////////////////////////
// app.post("/urls/:id", (req, res) => {

//   const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };

//   if (req.cookies) {
//     templateVars["user"] = userDb[req.cookies["userid"]];
//   } else {
//     templateVars["user"] = null;
//   }
//   res.redirect("urls_show", templateVars);
// });

app.post("/urls/:id/delete", (req, res) => {

  delete urlDatabase[req.params.id];

  res.redirect(`/urls`);
});

app.post("/urls/:id/edit", (req, res) => {

  urlDatabase[req.params.id] = req.body.longURL;

  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {

  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  let str = generateRandomString();
  urlDatabase[str] = req.body.longURL;
  res.redirect(`urls/${str}`);
});

app.post("/logout", (req, res) => {
  res.clearCookie("userid");
  res.redirect("/urls");
});

app.post("/register" ,(req,res) => {
  const {email, password} = req.body
  const userId = generateRandomString()
  userDb[userId] = {
    userId: userId,
    email,
    password, 
  } 
  res.cookie("userid", userId);
  res.redirect("/urls")

})



