generateRandomString = function() {
  let string =""
  for (let i = 6; i > 0; i--) {
    let setter = Math.floor(Math.random()*3)
    console.log(setter)
    if (setter === 0) {
      let charCodeIndex = Math.floor(Math.random() * (58 - 48) + 48)
      console.log(charCodeIndex) 
      string += String.fromCharCode(charCodeIndex)
    }    
    if (setter === 1) {
      let charCodeIndex = Math.floor(Math.random() * (91 - 65) + 65)
      console.log(charCodeIndex)
      string += String.fromCharCode(charCodeIndex)
      
    }    
    if (setter === 2) {
      let charCodeIndex = Math.floor(Math.random() * (123 - 97) + 97)
      console.log(charCodeIndex)
      string += String.fromCharCode(charCodeIndex)
      }
    
  }
  return string
}

module.exports = {generateRandomString}