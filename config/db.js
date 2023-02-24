const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectDB = async () => {
    try{
        const connection = await mongoose.connect(process.env.MONGO);
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch(error){
        console.log("Nepavyko prisijungt", error);
        process.exit(1);
    }
}

module.exports = connectDB;