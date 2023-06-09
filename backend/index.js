const connectToMongo = require('./db.js');
var cors = require('cors')
var express = require('express')


connectToMongo();
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
    console.log(`myNotebook backend listening at http://localhost:${port}`)
})