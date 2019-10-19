const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI'); // Here we created db as global variable using config

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('MongoDB Connected...');
    } catch (err) {
        console.log(err.message);
        //Exit process with faliure
        process.exit(1);
    }
}

module.exports = connectDB;