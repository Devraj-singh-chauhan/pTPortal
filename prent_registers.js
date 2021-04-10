const mongoose =require("mongoose");

const prentSchema = new mongoose.Schema({
    schoolname : {
        type:String,
        required:true
    },
    student_reg_no :{
        type:Number,
        required:true,
        unique: true
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

const Prent_registers = new mongoose.model("Prent_register",prentSchema);

module.exports =Prent_registers;