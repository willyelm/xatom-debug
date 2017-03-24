/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
class Greeter {
    constructor(greeting) {
        this.greeting = greeting;
    }
    greet() {
        console.log(this.greeting);
    }
}
;
var greeter = new Greeter("Hello, world!");
greeter.greet();
//# sourceMappingURL=test.js.map