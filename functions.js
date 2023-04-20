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

const findUser = function(id, obj) {
  for (const users in obj) {
    if (obj[users].email === id) {
      return obj[users];
    }
  }
  return false;
};

const getUserURLs = function(user, db) {
  const userURLs = {}
  for (const id in db ){
    if (db[id].userID === user) {
      userURLs[id] = db[id]    }
  }
  return userURLs
}

module.exports = {
  generateRandomString,
  findUser,
  getUserURLs,
}