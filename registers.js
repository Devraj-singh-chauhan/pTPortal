const mongoose =require("mongoose");

const tcherSchema = new mongoose.Schema({
    schoolname : {
        type:String,
        required:true
    },
    name : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    }
})

const Register = new mongoose.model("Register",tcherSchema);

module.exports =Register;