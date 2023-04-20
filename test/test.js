const assert = require('chai');
const { generateRandomString, findUser, getUserURLs } = require('../functions');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};


describe("#findUser", function(){
  it ("should return user object if valid"), function(){
    const user = findUser("userRandomID", testUsers)
    const expected =  {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    }

    assert.deepEqual(user, expected)
  }
})