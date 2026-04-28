const express = require('express');
const cors = require('cors');
require('dotenv').config();

// นำเข้าการเชื่อมต่อฐานข้อมูล (สำคัญมากสำหรับการทำ Login)
const db = require('./db'); 

const app = express();
app.use(cors()); // เปิดใช้งาน CORS สำหรับทุก origin
app.use(express.json()); // ส่งข้อมูลเป็น JSON

// เรียกใช้งาน Route ที่สร้างไว้
const attractionsRouter = require('./routes/attractions');

// ตั้งค่า Route ให้รองรับทั้ง /api/attractions และ /attractions เพื่อป้องกัน Error 404 บน Vercel
app.use('/api/attractions', attractionsRouter);
app.use('/attractions', attractionsRouter);

// 🟢 เพิ่มระบบ Login API ของภัทรพล ตรงนี้! 🟢
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
                accessToken: "pattharaphon-custom-token-9999", // จำลอง Token
                user: {
                    id: user.id,
                    fname: user.fname,
                    lname: user.lname,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar
                    student_id: user.student_id // 🟢 เพิ่มบรรทัดนี้ลงไปด้วย!
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

// หน้าแรก (Root) สำหรับเช็คว่า Server ออนไลน์อยู่หรือไม่
app.get('/', (req, res) => {
    res.send('Attraction & Login API is running...');
});

// Export app สำหรับ deploy บน Vercel (Serverless Function)
module.exports = app;

// ให้ start server เฉพาะเมื่อไม่ได้รันบน Vercel (Local)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3333; // ใช้ port 3333 สำหรับพัฒนาในเครื่อง
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
