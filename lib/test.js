"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var greet_1 = require("./greet");
var person2 = {
    name: 'Lavinia Dinu',
    age: 25,
    active: true,
    dateOfBirth: new Date(1992, 2, 25)
};
var person1 = {
    name: 'Williams Medina',
    age: 28,
    active: true,
    dateOfBirth: new Date(1989, 0, 28)
};
console.log(person1);
console.log(greet_1.Greet(person1));
console.log(greet_1.Greet(person2));
//# sourceMappingURL=test.js.map