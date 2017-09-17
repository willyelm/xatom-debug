"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var greet_1 = require("./greet");
var alsoalargefilenametotest_1 = require("./some/really/large/path/to/display/my/file/and/alsoalargefilenametotest");
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
alsoalargefilenametotest_1.Test();
//# sourceMappingURL=test.js.map