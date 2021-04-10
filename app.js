const express = require("express");
const path = require("path");
const app = express();
const hbs = require ("hbs");
const assert = require("assert");
const objectId = require("mongodb").ObjectID;

require("./db/conn");

const Register = require("./models/registers");
const Student_detail = require("./models/student_details");
const Prent_register = require("./models/prent_registers");
const Homework = require("./models/homeworks");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");
//console.log(path.join(__dirname,"../public"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

app.get("/",(req,res)=>{
    res.render("index");
});

app.post("/registerTcher", async(req,res)=>{
    try {
        // console.log(req.body.schoolname);
        // res.send(req.body.schoolname);
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if(password===cpassword){
            const registerTcher = new Register({
                schoolname : req.body.schoolname,
                name : req.body.name,
                email : req.body.email,
                password : req.body.password,
                cpassword : req.body.cpassword
            })
            const registered = await registerTcher.save();
            res.status(201).render("index");
        }else{
            res.send("passwords are not matching");
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post("/registerPrent", async(req,res)=>{
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        const student_reg_no = req.body.student_reg_no;
        console.log(`${password} , ${cpassword} and ${student_reg_no}`);
        const user=await Student_detail.findOne({reg_no:student_reg_no});
        // user.reg_no===student_reg_no;
        if (user.reg_no==student_reg_no) {
            if(password===cpassword){
                const registerPrent = new Prent_register({
                    schoolname : req.body.schoolname,
                    student_reg_no :req.body.student_reg_no,
                    name : req.body.name,
                    email : req.body.email,
                    password : req.body.password,
                    cpassword : req.body.cpassword
                })
                const registered = await registerPrent.save();
                res.status(201).render("index");
            }else{
                res.send("passwords are not matching");
            }
        } 
        
    } catch (error) {
        res.status(400).send("invalid credentials");
    }
});

app.post("/add_student_data",async(req,res)=>{
    try {
        const registerStudent = new Student_detail({  
            name : req.body.name,
            reg_no : req.body.reg_no
        })
        const registered= await registerStudent.save();
        res.status(201).render("home_tcher");
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post("/add_homework",async(req,res)=>{
    try {
        const addHomework = new Homework({  
            homework : req.body.homework,
            date : req.body.date
        })
        const added= await addHomework.save();
        res.status(201).render("home_tcher");
    } catch (error) {
        res.status(400).send(error);
    }
});
app.post("/update_homework",async(req,res)=>{
    try {
        const id =req.body.id;
        const homework =req.body.homework;

        Homework.updateOne({"_id":objectId(id)} , {$set:{homework:homework}},function(err,result){
            res.status(201).render("home_tcher");
            console.log("updated");
        });
        
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post("/loginTcher", async(req,res)=>{
    try {
        const email= req.body.email;
        const password= req.body.password;

        const user=await Register.findOne({email:email})    
        //res.send(useremail)
        if(user.password===password){
            res.status(201).render("home_tcher.hbs");
        }else{
            res.send("invalid credentials");
        }
        //console.log(`${email} and ${password}`);
        //res.status(201).render(login);
    } catch (error) {
        res.status(400).send("invalid credentials");
    }
});

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.post("/loginPrent", async(req,res)=>{
    try {
        const email= req.body.email;
        const password= req.body.password;
        // console.log(`${email} and ${password}`);
        const user=await Prent_register.findOne({email:email});    
        const user_child=await Student_detail.findOne({reg_no:user.student_reg_no});

        // user_child.forEach(function(doc,err){
        //     const user__child=doc;
        // });
        if(user.password===password){
            res.status(201).render("home_prent",{childinfo: user_child});
        }else{
            res.send("invalid credentials");
        }
        //console.log(`${email} and ${password}`);
        //res.status(201).render(login);
    } catch (error) {
        
        res.status(400).send("invalid credentialsss");
    }
});

app.get("/get_student_data", async(req,res)=>{
    console.log("enterd in it");
    try {
        var resultArray=[];  
        var cursor= await Student_detail.find();

        cursor.forEach(function(doc,err){    
            //assert.equal(null,err);
            resultArray.push(doc);
            console.log(resultArray);
        },res.status(201).render("home_tcher",{details: resultArray}));  
    } catch (error) {
        console.log("error sent");
        res.status(400).send(error);
    }
});

app.get("/get_homework_details", async(req,res)=>{

    try {
        var resultArray=[];  
        var cursor= await Homework.find();

        cursor.forEach(function(doc,err){    
            //assert.equal(null,err);
            resultArray.push(doc);

        },res.status(201).render("home_tcher",{hw_details: resultArray}));  
    } catch (error) {
        console.log("error sent");
        res.status(400).send(error);
    }
});

app.get("/get_homework", async(req,res)=>{
    try {
        var resultArray=[];  
        var cursor= await Homework.find();

        cursor.forEach(function(doc,err){    
            //assert.equal(null,err);
            resultArray.push(doc);

        },res.status(201).render("home_prent",{hw_details: resultArray}));  
    } catch (error) {
        console.log("error sent");
        res.status(400).send(error);
    }
});
app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
});

