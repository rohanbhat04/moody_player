const mongoose = require('mongoose');

function connectToDB(){

    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("connected to DB successfully");
    })
    .catch((error)=>{
        console.log("error: ",error);
    })
}

module.exports = connectToDB