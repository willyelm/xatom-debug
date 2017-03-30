interface Person {
  firstName: string,
  lastName: string,
  age: number,
  active: boolean,
  dateOfBirth: Date
}

var person: Person = {
  firstName: 'Williams',
  lastName: 'Medina',
  age: 28,
  active: true,
  dateOfBirth: new Date()
}

function Greet (person: Person) {
  console.log(`Hi!, my name is ${person.firstName} ${person.lastName}`)
}

// greet
Greet(person)
