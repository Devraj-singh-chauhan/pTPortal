const mongoose =require("mongoose");

const studentSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },

    reg_no:{
        type:Number,
        required:true,
        unique:true
    },
})

const Student_detail = new mongoose.model("Student_detail",studentSchema);

module.exports =Student_detail;