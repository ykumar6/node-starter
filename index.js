const express = require('express')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const bodyParser = require('body-parser')

const app = express()
const host = process.env.RUNNABLE_CONTAINER_URL || 'localhost'
const port = process.env.PORT || 3000
const mongoHost = process.env.MONGO_HOST || 'mongodb://localhost/todo'

mongoose.connect(mongoHost)
mongoose.connection.on('error', () => {
  console.log('ERROR: Unable to connect to MongoDB.')
})

const todos = require('./todos')

function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}

function errorHandler (err, req, res, next) {
  res.status(500)
  res.json({ error: err })
}

app.listen(port, () => {
  var hostName = 'http://' + host + ':' + port
  console.log('Application running at: ' + hostName)
})

app.use(bodyParser.json())
app.use(logErrors)
app.use(errorHandler)

// Routes
app.use('/', express.static('public'))
app.get('/api/todos', todos.all)
app.get('/api/todos/:id', todos.one)
app.post('/api/todos', todos.create)
app.put('/api/todos/:id', todos.update)
app.delete('/api/todos/:id', todos.delete)
