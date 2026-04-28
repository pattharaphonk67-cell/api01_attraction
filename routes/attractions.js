const express = require('express');
const router = express.Router();
// 🔴 จุดสำคัญ: ต้องเป็น ../db เพราะไฟล์ db.js อยู่ข้างนอกโฟลเดอร์ routes
const db = require('../db'); 

// 🟢 API สำหรับดึงข้อมูลสินค้าทั้งหมดจากตาราง attractions ใน TiDB
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM attractions');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching attractions:', err);
        res.status(500).json({ 
            status: "error", 
            message: "Failed to fetch data from database",
            error: err.message 
        });
    }
});

module.exports = router;
