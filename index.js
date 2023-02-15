const express = require("express")
const cors = require('cors')
const morgan = require('morgan')
const app = express()


//order of middlewares matters
app.use(express.json())
app.use(cors())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'))

//-----------------------


let people = []

app.get('/api/persons', (req, res) => {
  res.json(people) //convert from js object to json object
})

app.get('/info', (req, res) => {
  res.end(
    `<p> 
            Phonebook has info for ${people.length} people
            </br>
            ${new Date()}
    </p>`
  )
})

app.get('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const requestedPerson = people.find(p => p.id === id)

  requestedPerson
    ? res.json(requestedPerson)
    : res.status(404).end("Person does not exist")
})

app.delete('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const requestedPerson = people.find(p => p.id === id)

  if(requestedPerson)
  {
    people = people.filter(p => p.id !== requestedPerson.id)
    console.log(people)
    res.status(204).end()
  } 
  else res.status(404).end("Person does not exist")
})

const generateRandomId = () => Math.floor(Math.random() * 99999)

app.post('/api/persons', (req, res) => {
  const body = req.body
  const name = req.body.name
  const number = req.body.number


  if(!name || !number) {
    res.status(400).json({
      error: 'name or number is missing'
    })
    return
  }

  if(people.find(p => p.name === name)) {
    res.status(400).json({
      error: 'that name already exists in the phonebook'
    })
    return
  }

  const newPerson = {
    ...req.body,
    id: generateRandomId(),
  }

  people = people.concat(newPerson)
  res.status(201).send(newPerson)
})

//must be after all routes are defined
app.use((req, res, next) => {
  res.status(404).send({error: 'unknown endpoint'})
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log('Listening on port ', PORT)
})
