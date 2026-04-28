const express = require('express');
const cors = require('cors');
require('dotenv').config();

// นำเข้าการเชื่อมต่อฐานข้อมูล
const db = require('./db'); 

const app = express();
app.use(cors()); // เปิดใช้งาน CORS สำหรับทุก origin
app.use(express.json()); // ส่งข้อมูลเป็น JSON

// เรียกใช้งาน Route สำหรับดึงข้อมูลสินค้า
const attractionsRouter = require('./routes/attractions');

// ตั้งค่า Route
app.use('/api/attractions', attractionsRouter);
app.use('/attractions', attractionsRouter);

// 🟢 ระบบ Login API ของภัทรพล 🟢
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // ไปค้นหาใน TiDB ว่ามี User และ Password นี้ไหม
        const [users] = await db.query(
            'SELECT * FROM users WHERE username = ? AND password = ?', 
            [username, password]
        );

        // ถ้าเจอข้อมูล (ล็อกอินถูก)
        if (users.length > 0) {
            const user = users[0];
            res.status(200).json({
                status: "ok",
                message: "Login Success",
                accessToken: "pattharaphon-custom-token-9999", 
                user: {
                    id: user.id,
                    fname: user.fname,
                    lname: user.lname,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar, // 🟢 เติมจุลภาคตรงนี้ให้แล้ว!
                    student_id: user.student_id // 🟢 ส่งรหัสนักศึกษาจาก TiDB ไปหาแอป
                }
            });
        } else {
            // ถ้าไม่เจอ (ล็อกอินผิด)
            res.status(401).json({
                status: "error",
                message: "Invalid username or password"
            });
        }
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// หน้าแรกสำหรับเช็คสถานะ Server
app.get('/', (req, res) => {
    res.send('Attraction & Login API for Pattharaphon is running...');
});

// Export app สำหรับ deploy บน Vercel
module.exports = app;

// ให้ start server เฉพาะเมื่อไม่ได้รันบน Vercel (Local)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3333;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
