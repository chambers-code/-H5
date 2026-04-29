const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * 获取产品视频列表
 * GET /api/product-videos?city_id=xxx
 */
router.get('/', async (req, res) => {
  try {
    const { city_id } = req.query;
    let query = 'SELECT * FROM product_videos WHERE status = 1';
    const params = [];

    if (city_id) {
      query += ' AND city_id = ?';
      params.push(city_id);
    }

    query += ' ORDER BY sort_order ASC';
    const [rows] = await db.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 创建产品视频
 * POST /api/product-videos
 */
router.post('/', async (req, res) => {
  try {
    const { city_id, title, video_url, cover_image, description, sort_order } = req.body;

    const [result] = await db.query(
      'INSERT INTO product_videos (city_id, title, video_url, cover_image, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [city_id, title, video_url, cover_image, description, sort_order || 0]
    );
    res.json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 更新产品视频
 * PUT /api/product-videos/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { city_id, title, video_url, cover_image, description, sort_order, status } = req.body;

    await db.query(
      'UPDATE product_videos SET city_id = ?, title = ?, video_url = ?, cover_image = ?, description = ?, sort_order = ?, status = ? WHERE id = ?',
      [city_id, title, video_url, cover_image, description, sort_order, status, req.params.id]
    );
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 删除产品视频
 * DELETE /api/product-videos/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM product_videos WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
