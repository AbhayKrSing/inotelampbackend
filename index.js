const express = require('express')
const MongoConnect = require('./db.js')
const path = require('path');
var cors = require('cors')
const app = express()
app.use(cors())
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
app.use(express.json())
app.use('/api/auth', require('./routes/Auth.js'))
app.use('/api/notes', require('./routes/Notes.js'))

MongoConnect();
app.get('/', (req, res) => {
    res.send('hello')
})
app.listen(process.env.PORT || 5000, () => {
    console.log('listening backend at port' + (process.env.PORT || 5000))
})