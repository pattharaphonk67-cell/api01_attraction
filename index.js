const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // เปิดใช้งาน CORS สำหรับทุก origin
app.use(express.json()); // ส่งข้อมูลเป็น JSON

// เรียกใช้งาน Route ที่สร้างไว้
const attractionsRouter = require('./routes/attractions');
app.use('/api/attractions', attractionsRouter);

// Export app สำหรับ deploy บน Vercel
module.exports = app;

// ให้ start server เฉพาะเมื่อไม่ได้รันบน Vercel (Local)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3333; // ใช้ port 3333 สำหรับพัฒนาในเครื่อง
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}