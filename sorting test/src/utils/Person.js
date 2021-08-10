import faker from 'faker/dist/faker';

export default class Person{
    constructor(id, quantity){
        this.id = id
        this.name = faker.name.findName(),
        this.email = faker.internet.email(),
        this.potatoQuantity = quantity
    }
}