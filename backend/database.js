const mongoose = require('mongoose');
const connection = "mongodb+srv://one:onetwothree@cluster0.5knhd.mongodb.net/d2c?retryWrites=true&w=majority";
mongoose.connect(connection,{ useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));