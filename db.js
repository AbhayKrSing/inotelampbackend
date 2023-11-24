const mongoose = require('mongoose');
mongoose.set('strictQuery', true)


let connectTomongo = () => {
  mongoose.connect(process.env.Mongo_URL, (err) => {
    if (!err) console.log("Connected")
    else console.log(err.message)
  })
}
module.exports = connectTomongo
