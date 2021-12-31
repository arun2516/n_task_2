const express = require("express");
const {MongoClient} = require("mongodb");
var cors = require("cors");
require("dotenv").config();
const server = express();
const port = 3000;
server.use(express.json());
server.use(cors);

//create mentor

server.post("/create_mentor", async(req,res)=>{
    try{
        let client = new MongoClient(process.env.DB_URL);
        await client.connect();
        let db =  client.db(process.env.DB_NAME);
        let result = await db.collection("mentor").insertOne(req.body);
        res.status(200).json({message:"mentor created"});
        client.close();
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

// create a student

server.use("/create_student",async(req,res)=>{
    try{
        let client = new MongoClient(process.env.DB_URL);
        await client.connect();
        let db = client.db(process.env.DB_NAME);
        let result = await db.collection("students").insertOne(req.body);
        res.status(200).json({ message: "students created" });
        client.close();

    }catch(error){
        console.log(error);
    res.sendStatus(500);
    }
});

// assign a mentor

server.put("/assign_mentor", async(req,res)=>{
    try{
        let client = new MongoClient(process.env.DB_URL);
        await client.connect();
        let db = client.db(process.env.DB_NAME);
        await db.collection("students").updateMany(
            {student_name:req.body.student_name},
            {$set:{mentor_name:req.body.mentor_name}}
        );
        let result = await db.collection("students").find().toArray();
        res.status(200).json({message:"mentor assigned",result});
        client.close();
    }catch(error){
        console.log(error);
      res.sendStatus(500);
    }
});

//assign student

server.put("/assign_student",async(req,res)=>{
    try{
        let client = new MongoClient(process.env.DB_URL);
        await client.connect();
        let db = client.db(process.env.DB_NAME);
        let result = await db.collection("students").updateMany(
            {mentor_name:req.body.mentor_name},
            {$set:{student_name:req.body.student_name}}
            );
            res.status(200).json({
                message: "mentor assigned or changed to a particular student"
            });
            client.close();
    }catch(error){
        console.log(error);
      res.sendStatus(500);
    }
});

// read student-list

server.get("/students-list",async(req,res)=>{
    try{
        let client = new MongoClient(process.env.DB_URL);
        await client.connect();
        let db = client.db(process.env.DB_NAME);
        let result = await db.collection("students").find().toArray();
        res.status(200).json({ message: " student list", result });
        client.close();
    }catch(error){
        console.log(error);
    res.sendStatus(500);
    }
});

// read mentor_list

server.get("/students-list",async(req,res)=>{
    try{
        let client = new MongoClient(process.env.DB_URL);
        await client.connect();
        let db = client.db(process.env.DB_NAME);
        let result = await db.collection("mentor").find().toArray();
        res.status(200).json({ message: " mentor list", result });
        client.close();
    }catch(error){
        console.log(error);
    res.sendStatus(500);
    }
});

// students without mentor

server.get("/idle-students", async(req,res)=>{
    try{
        let client = new MongoClient(process.env.DB_URL);
        await client.connect();
        let db = client.db(process.env.DB_NAME);
        let result = await db.collection("students").find({mentor_name:null}).toArray();
        res.status(200).json({
            message: "list of students without a mentor",
            result,
        });
        client.close();
    }catch(error){
        console.log(error);
        res.sendStatus(500);
    }
})

//student under_mentor

server.get("/student_under-mentor/:mentor_name",async(req,res)=>{
    try{
        let client = new MongoClient(process.env.DB_URL);
        await client.connect();
        let db = client.db(process.env.DB_NAME);
        let result = await db.collection("students").find({ mentor_name: req.params.mentor_name }).toArray();
        res.status(200).json({
            message: `students under mentor_name: `,
            result,  
        });
        client.close();

    }catch(error){
        console.log(error);
      res.sendStatus(500);
    }
});

server.listen(port,() => {
    console.log("server started at " + port);
  });