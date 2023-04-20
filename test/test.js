const assert = require('chai').assert;
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

describe("#findUser", function() {
  it("should return user object if valid", function() {
    const user = findUser("user@example.com", testUsers);
    const expected = {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    };

    assert.deepEqual(user, expected);
  });
  it ("should return false if usser not in DB", function(){
    const user = findUser("user@example.ca", testUsers)
    const expected =  false

    assert.deepEqual(user, expected)
  })
});