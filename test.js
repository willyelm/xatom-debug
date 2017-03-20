var person = {
  firstName: 'Williams',
  lastName: 'Medina'
}

function Greet (m) {
  console.log(m);
}

function Bye (m) {
  console.log(m);
}
//
// for (i = 0; i < cars.length; i++) {
//   console.log('hello', i);
// }
//
setTimeout(function () {
  console.log('yep');
}, 10000);

console.log('person', process, person);

Greet('Hello World');
Bye('Good Bye');
