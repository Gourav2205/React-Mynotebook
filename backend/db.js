const mongoose = require('mongoose');

const mongoURI = `mongodb://127.0.0.1:27017/iNotebook`
const connectToMongo = async () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(mongoURI)
        console.log("Connected to mongo succesfuly")
    } catch (err) {
        console.log(err)
    }
}



module.exports = connectToMongo;