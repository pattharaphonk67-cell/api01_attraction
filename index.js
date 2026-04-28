const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db'); 

const app = express();
app.use(cors());
app.use(express.json());

// นำเข้าไฟล์ดึงข้อมูลสินค้า
const attractionsRouter = require('./routes/attractions');

// ตั้งค่า Route
app.use('/api/attractions', attractionsRouter);
app.use('/attractions', attractionsRouter);

// 🟢 ระบบ Login API
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
                    student_id: user.student_id 
                }
            });
        } else {
            res.status(401).json({ status: "error", message: "Invalid user" });
        }
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('IT Store API is Online!');
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3333;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
