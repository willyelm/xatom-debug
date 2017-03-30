interface Person {
    firstName: string;
    lastName: string;
    age: number;
    active: boolean;
    dateOfBirth: Date;
}
declare var person: Person;
declare function Greet(person: Person): void;
