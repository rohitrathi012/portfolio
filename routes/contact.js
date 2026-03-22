const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const MESSAGES_FILE = path.join(__dirname, '../data/messages.json');

// POST: /api/contact
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        // 1. Save message to JSON file
        const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8') || '[]');
        const newMessage = {
            id: Date.now(),
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString()
        };
        messages.push(newMessage);
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));

        // 2. Send Email using Nodemailer
        // NOTE: User needs to provide EMAIL_USER and EMAIL_PASS in .env
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'rathirohit126@gmail.com',
                subject: `Portfolio Contact: ${subject}`,
                text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
            };

            await transporter.sendMail(mailOptions);
            return res.json({ success: true, message: 'Message sent successfully (Email & Logged)!' });
        }

        // If no email configured, just return success since we logged it
        res.json({ success: true, message: 'Message received and logged locally!' });

    } catch (error) {
        console.error('Contact API Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

module.exports = router;
