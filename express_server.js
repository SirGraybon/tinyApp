const express = require('express');
const app = express();
const PORT = 8080;
//const generateRandomString = require('./generator')


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


app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`example app started on port: ${PORT}`);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index.ejs", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {

  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls", (req, res) => {
  console.log(req.body);// Log the POST request body to the console
  let str = generateRandomString();
  urlDatabase[str] = req.body.longURL;
  console.log(urlDatabase);
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

