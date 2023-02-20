require('dotenv').config()
const express = require("express")
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()


//order of middlewares matters
app.use(express.json())
app.use(express.static('build'))
app.use(cors())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'))

//-----------------------

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(people => res.json(people))
    .catch(err => next(err))
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

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(foundPerson => {
      if(foundPerson)
        res.json(foundPerson)
      else res.status(404).end()
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      return res.status(204).end()
    })
    .catch(err => {
      next(err)
    })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  const name = req.body.name
  const number = req.body.number


  if(!name || !number) {
    res.status(400).json({
      error: 'name or number is missing'
    })
    return
  }

  Person.find({})
    .then(people => {
      if(people.find(p => p.name === name)) {
        res.status(400).json({
          error: 'that name already exists in the phonebook'
        })
        return
      }
    })
    .catch(err => next(err))

  const newPerson = new Person({
    name, number
  })

  newPerson.save()
    .then(savedPerson => {
    res.status(201).send(savedPerson)
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const changedPerson = {
    ...req.body
  }

  Person.findByIdAndUpdate(req.params.id, changedPerson, {new: true})
    .then(updatedPerson => {
      res.status(200).json(updatedPerson)
    })
    .catch(err => next(err))
})

//must be after all routes are defined
app.use((req, res, next) => {
  res.status(404).send({error: 'unknown endpoint'})
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  
  if(error.name === 'CastError')
    return res.status(400).send({ error: 'Malformatted ID' })

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log('Listening on port ', PORT)
})
