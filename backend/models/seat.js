const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seatSchema = new Schema({
    allseats: [[{
        type: Number,
        required: true
    }]]
})
module.exports = mongoose.model("Seat", seatSchema, "seats")