const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');
const authMiddleware = require('./middleware/auth'); // Import it


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

    app.post('/api/users', authMiddleware, async (req, res) => {
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


   app.delete('/api/users/:id', authMiddleware, async (req,res) => {
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

   app.put("/api/users/:id", authMiddleware, async (req,res) =>{
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


   const jwtSecret = process.env.JWT_SECRET;

   // Admin Registration Endpoint

   
// REGISTER ADMIN (Run this once via Postman/ThunderClient)
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 1. Encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Create the Admin
        const newAdmin = new Admin({ username, 
            password: hashedPassword });
        await newAdmin.save();

        res.json({ message: "Admin created successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error creating admin" });
    }
});

// ADMIN LOGIN ENDPOINT

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        // Generate JWT
        const token = jwt.sign({ adminId: admin._id }, jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Error logging in" });
    }
});


// CHANGE PASSWORD ROUTE (Protected)
app.put('/api/change-password', authMiddleware, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const adminId = req.user.id; // Get ID from the Token (Middleware put it there)

        // 1. Find Admin
        const admin = await Admin.findById(adminId);
        if (!admin) return res.status(404).json({ error: "Admin not found" });

        // 2. Check if OLD password is correct
        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect Old Password" });
        }

        // 3. Encrypt the NEW password
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);

        // 4. Save
        await admin.save();
        res.json({ message: "Password updated successfully!" });

    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});


// start the server
// NEW WAY (For Vercel)
const PORT = process.env.PORT || 5000;

// Only listen if we are running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // Export the app for Vercel