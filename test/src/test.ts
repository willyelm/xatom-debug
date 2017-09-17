import { Greet } from './greet';
import { Person } from './person';
import { Test } from './some/really/large/path/to/display/my/file/and/alsoalargefilenametotest';

var person2: Person = {
  name: 'Lavinia Dinu',
  age: 25,
  active: true,
  dateOfBirth: new Date(1992, 2, 25)
};

var person1: Person = {
  name: 'Williams Medina',
  age: 28,
  active: true,
  dateOfBirth: new Date(1989, 0, 28)
};

console.log(person1);
console.log(Greet(person1));
console.log(Greet(person2));

Test();
