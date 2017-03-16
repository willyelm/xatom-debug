// Atom Bugs: Test
function Greet (msg) {
  console.log(msg)
}
// Hello
let test = new Greet()
let testString = 'Hello World Hello'
let textObject = {
  title: 'Some Object',
  n: 123,
  otherTest: {
    value: 1
  },
  test () {
    console.log('test')
  }
}
let testArray = ['1', '2', '3']
let testDate = new Date()
let testBoolean = true
let testNumber = 123123

Greet(test)
Greet(testString)
Greet(textObject)
Greet(testArray)
Greet(testDate)
Greet(testBoolean)
Greet(testNumber)
