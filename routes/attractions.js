const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 🔴 เช็คให้ชัวร์ว่ามึงมีไฟล์ชื่อ db.js อยู่ข้างๆ index.js
const db = require('./db'); 

const app = express();
app.use(cors());
app.use(express.json());

// 🔴 เช็คให้ชัวร์ว่ามึงมีโฟลเดอร์ routes และไฟล์ attractions.js
const attractionsRouter = require('./routes/attractions');
app.use('/api/attractions', attractionsRouter);
app.use('/attractions', attractionsRouter);

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [users] = await db.query(
            'SELECT * FROM users WHERE username = ? AND password = ?', 
            [username, password]
        );

        if (users.length > 0) {
            const user = users[0];
            res.status(200).json({
                status: "ok",
                message: "Login Success",
                user: {
                    id: user.id,
                    fname: user.fname,
                    lname: user.lname,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    student_id: user.student_id // 🟢 ส่งรหัสนักศึกษาไปหา Flutter
                }
            });
        } else {
            res.status(401).json({ status: "error", message: "Invalid username or password" });
        }
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('IT Store API is Online!');
});

module.exports = app;
