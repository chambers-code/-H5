const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * 获取公司介绍列表
 * GET /api/company-intros?city_id=xxx
 */
router.get('/', async (req, res) => {
  try {
    const { city_id } = req.query;
    let query = 'SELECT * FROM company_intros WHERE status = 1';
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
 * 创建公司介绍
 * POST /api/company-intros
 */
router.post('/', async (req, res) => {
  try {
    const { city_id, title, content, images, sort_order } = req.body;
    const imagesJson = images ? JSON.stringify(images) : null;

    const [result] = await db.query(
      'INSERT INTO company_intros (city_id, title, content, images, sort_order) VALUES (?, ?, ?, ?, ?)',
      [city_id, title, content, imagesJson, sort_order || 0]
    );
    res.json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 更新公司介绍
 * PUT /api/company-intros/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { city_id, title, content, images, sort_order, status } = req.body;
    const imagesJson = images ? JSON.stringify(images) : null;

    await db.query(
      'UPDATE company_intros SET city_id = ?, title = ?, content = ?, images = ?, sort_order = ?, status = ? WHERE id = ?',
      [city_id, title, content, imagesJson, sort_order, status, req.params.id]
    );
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 删除公司介绍
 * DELETE /api/company-intros/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM company_intros WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
