// Atom Bugs: Test
function HelloWorld () {
  this.message = 'bye'
}

class Another {
  constructor () {
    this.hello = 'my'
  }
}

class MyClass extends Another {
  constructor () {
    super()
    this.test = `${this.hello} test`
    this.obj = {
      othervalue: '123',
      test () {
        console.log('test')
      },
      subObject: {
        value: '123'
      },
      subObject2: {
        value2: '123'
      }
    }
  }
}

let test = Object.create(HelloWorld)
let test2 = new HelloWorld()
let ref = test2
let object = new Another()
let object2 = new MyClass()
var project = require('./dependency')
let testString = 'Hello World Hello'
let textObject = {
  title: 'Some Object'
}
let testArray = ['1', '2', '3']
let testDate = new Date()
let testBoolean = true
let testNumber = 123123

function Greet (msg) {
  console.log(msg)
}

Greet(test)
Greet(test2)
Greet(ref)
Greet(object)
Greet(object2)
Greet(testString)
Greet(textObject)
Greet(testArray)
Greet(testDate)
Greet(testBoolean)
Greet(testNumber)
Greet(project.getMessage())
