const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// load environment variables from .env file
dotenv.config();

// middlewares
app.use(cors());
app.use(express.json());



//connect to mongoDB

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("💯Connected to MongoDB Atlas "))
    .catch((error) => console.error("❌Error connecting to MongoDB Atlas:", error));


// create a simple user schema

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    role : {
        type: String,
        required: true
    },
    company : {
        type: String,
        required: true
    }
});


// the tool to interact with the "users" collection in MongoDB

const User = mongoose.model('User', userSchema);

// API endpoint to get all users

   // fetch all users from the database


   app.get('/', (req, res) => {
    res.send("Welcome to the User API");
   });


   app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }   
    });


    // add new user to the database

    app.post('/api/users', async (req, res) => {
        try {
            const { name, role, company } = req.body;
            const newUser = new User({ name, role, company });
            await newUser.save();
            res.status(201).json(newUser);
        } catch (error) {
            console.error("Error adding user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    //delete user endpoint (optional)

   app.delete('/api/users/:id',async (req,res) => {
    try {
        const {id} = req.params;
       await User.findByIdAndDelete(id);
       res.status(200).json({message: "User deleted successfully"});
    }
    catch(error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
   })

   //update user endpoint (optional)

   app.put("/api/users/:id",async (req,res) =>{
    try{
        const {id} = req.params;
        const {name, role, company} = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, {name, role, company}, {new: true});
        res.status(200).json(updatedUser);
    } catch(error){
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
   })


// start the server
const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});