const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname : {
        type: String,
        required: true
    },
    lastname : {
        type: String,
        required: true
    },
    emailid : {
        type: String,
        required: true,
        unique: true
    },
    phoneno : {
        type: Number,
        required: true,
        unique: true
    },
    address : {
        type: String,
        required: true
    },
    zipcode : {
        type: Number,
        required: true
    },
    gender : {
        type: String,
        required: true,
    },
    password : {
        type: String,
        required: true
    },
    confirmpassword : {
        type: String,
        required: true
    }
})

//now we need to create a collection

const User = new mongoose.model("User", userSchema);

module.exports = User;
