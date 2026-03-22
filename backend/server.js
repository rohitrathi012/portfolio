const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const ContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
});

const Contact = mongoose.model("Contact", ContactSchema);

// Email setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API
app.post("/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Save to DB
        const newContact = new Contact(req.body);
        await newContact.save();

        // Send email
        await transporter.sendMail({
            from: email,
            to: process.env.EMAIL_USER,
            subject: subject,
            text: message
        });

        res.send("Message sent & saved!");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error");
    }
});

app.listen(process.env.PORT, () => {
    console.log("Server running on port 5000");
});