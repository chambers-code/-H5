const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * 获取产品介绍列表
 * GET /api/product-intros?city_id=xxx
 */
router.get('/', async (req, res) => {
  try {
    const { city_id } = req.query;
    let query = 'SELECT * FROM product_intros WHERE status = 1';
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
 * 创建产品介绍
 * POST /api/product-intros
 */
router.post('/', async (req, res) => {
  try {
    const { city_id, title, content, images, sort_order } = req.body;
    const imagesJson = images ? JSON.stringify(images) : null;

    const [result] = await db.query(
      'INSERT INTO product_intros (city_id, title, content, images, sort_order) VALUES (?, ?, ?, ?, ?)',
      [city_id, title, content, imagesJson, sort_order || 0]
    );
    res.json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 更新产品介绍
 * PUT /api/product-intros/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { city_id, title, content, images, sort_order, status } = req.body;
    const imagesJson = images ? JSON.stringify(images) : null;

    await db.query(
      'UPDATE product_intros SET city_id = ?, title = ?, content = ?, images = ?, sort_order = ?, status = ? WHERE id = ?',
      [city_id, title, content, imagesJson, sort_order, status, req.params.id]
    );
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 删除产品介绍
 * DELETE /api/product-intros/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM product_intros WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
