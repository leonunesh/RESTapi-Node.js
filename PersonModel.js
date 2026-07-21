const mongoose = require('mongoose');
const { Schema } = mongoose;

const personSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
    },
    city:{
        type: String,
        required: [true, 'City is required'],
    },
    country:{
        type: String,
        required: [true, 'Country is required'],
    },
    salary:{
        type: Number,
        required: [true, 'Salary is required'],
        min: [0, 'Salary must be a positive number'],
    }
});

const PersonModel = mongoose.model('Person', personSchema);
module.exports = PersonModel;