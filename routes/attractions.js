const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. API สำหรับดึงข้อมูลทั้งหมดไปแสดงผลใน Flutter App
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM attractions');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. API สำหรับสร้างตารางและนำเข้าข้อมูลจาก JSONBin (ดึงข้อมูลสินค้า IT)
router.get('/init', async (req, res) => {
    try {
        // สร้างตารางรองรับข้อมูล (ถ้ายังไม่มี) [cite: 46-47, 114]
        await db.query(`
            CREATE TABLE IF NOT EXISTS attractions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                detail TEXT,
                coverimage VARCHAR(500),
                latitude DECIMAL(10,8),
                longitude DECIMAL(11,8),
                likes INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // ดึงข้อมูลจากลิงก์ JSONBin ของคุณ
        const response = await fetch('https://api.jsonbin.io/v3/b/69bced0eaa77b81da9ffe42d?meta=false');
        const data = await response.json();

        // ล้างข้อมูลเก่าออกก่อนเพื่อให้ข้อมูลเป็นปัจจุบัน
        await db.query('TRUNCATE TABLE attractions');

        // วนลูปนำเข้าข้อมูล โดยแก้ชื่อ Key ให้ตรงกับ JSON (description, imageUrl)
        for (let item of data) {
            await db.query(
                'INSERT INTO attractions (name, detail, coverimage, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
                [
                    item.name,
                    item.description, // แก้ให้ตรงกับ JSON
                    item.imageUrl,    // แก้ให้ตรงกับ JSON
                    null,             // สินค้าไม่มีค่าพิกัด
                    null              // สินค้าไม่มีค่าพิกัด
                ]
            );
        }
        res.status(201).json({ message: "สร้างตารางและนำเข้าข้อมูลจาก JSONBin ลง TiDB สำเร็จ!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;