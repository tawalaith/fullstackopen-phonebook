const mongo = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://phonebook:${password}@cluster0.87copyv.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongo.set('strictQuery', false)
mongo.connect(url)

const personSchema = new mongo.Schema({
    name: String,
    number: String
})

const Person = mongo.model('Person', personSchema)

if(name && number)
{
    const person = new Person({ name, number })
    
    person.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to phonebook`)
        mongo.connection.close()
    })
} 
else
{
    console.log('Phonebook:')
    Person.find({}).then((people) => {
        people.forEach(p => console.log(p.name, p.number))
        mongo.connection.close()
    })
}
