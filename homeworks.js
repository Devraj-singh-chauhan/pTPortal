const { text } = require("express");
const mongoose =require("mongoose");

const homeworkSchema = new mongoose.Schema({
    homework : {
        type:String,
        unique:true,
        required:true
    },
    date:{
        type:String,
        required:true
    }
})

const Homework = new mongoose.model("Homework",homeworkSchema);

module.exports =Homework;