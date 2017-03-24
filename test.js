function Person (name) {
  this.name = name;
}

Person.prototype.getName = function () {
  console.log(this.name);
}

var test = new Person('Robot');

var person = {
  firstName: 'Williams',
  lastName: 'Medina',
  age: 28,
  active: true,
  dateOfBirth: new Date()
}

function Greet (m) {
  console.log(m);
}
// for (i = 0; i < cars.length; i++) {
//   console.log('hello', i);
// }

setTimeout(function () {
  console.log('yep');
}, 10000);

test.getName();

Greet('Hello World');
