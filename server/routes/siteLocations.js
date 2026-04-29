const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * 获取站点位置列表
 * GET /api/site-locations?city_id=xxx
 */
router.get('/', async (req, res) => {
  try {
    const { city_id } = req.query;
    let query = 'SELECT * FROM site_locations WHERE status = 1';
    const params = [];

    if (city_id) {
      query += ' AND city_id = ?';
      params.push(city_id);
    }

    query += ' ORDER BY sort_order ASC';
    const [rows] = await db.query(query, params);

    rows.forEach(row => {
      if (row.images) {
        try {
          row.images = JSON.parse(row.images);
        } catch (e) {
          row.images = [];
        }
      }
    });

    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 创建站点位置
 * POST /api/site-locations
 */
router.post('/', async (req, res) => {
  try {
    const { city_id, name, address, latitude, longitude, phone, business_hours, images, sort_order } = req.body;
    const imagesJson = images ? JSON.stringify(images) : null;

    const [result] = await db.query(
      'INSERT INTO site_locations (city_id, name, address, latitude, longitude, phone, business_hours, images, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [city_id, name, address, latitude, longitude, phone, business_hours, imagesJson, sort_order || 0]
    );
    res.json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 更新站点位置
 * PUT /api/site-locations/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { city_id, name, address, latitude, longitude, phone, business_hours, images, sort_order, status } = req.body;
    const imagesJson = images ? JSON.stringify(images) : null;

    await db.query(
      'UPDATE site_locations SET city_id = ?, name = ?, address = ?, latitude = ?, longitude = ?, phone = ?, business_hours = ?, images = ?, sort_order = ?, status = ? WHERE id = ?',
      [city_id, name, address, latitude, longitude, phone, business_hours, imagesJson, sort_order, status, req.params.id]
    );
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 删除站点位置
 * DELETE /api/site-locations/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM site_locations WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
