const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * 获取申请流程列表
 * GET /api/application-flows?city_id=xxx
 */
router.get('/', async (req, res) => {
  try {
    const { city_id } = req.query;
    let query = 'SELECT * FROM application_flows WHERE status = 1';
    const params = [];

    if (city_id) {
      query += ' AND city_id = ?';
      params.push(city_id);
    }

    query += ' ORDER BY step_number ASC';
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
 * 创建申请流程
 * POST /api/application-flows
 */
router.post('/', async (req, res) => {
  try {
    const { city_id, step_number, title, content, images } = req.body;
    const imagesJson = images ? JSON.stringify(images) : null;

    const [result] = await db.query(
      'INSERT INTO application_flows (city_id, step_number, title, content, images) VALUES (?, ?, ?, ?, ?)',
      [city_id, step_number, title, content, imagesJson]
    );
    res.json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 更新申请流程
 * PUT /api/application-flows/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { city_id, step_number, title, content, images, status } = req.body;
    const imagesJson = images ? JSON.stringify(images) : null;

    await db.query(
      'UPDATE application_flows SET city_id = ?, step_number = ?, title = ?, content = ?, images = ?, status = ? WHERE id = ?',
      [city_id, step_number, title, content, imagesJson, status, req.params.id]
    );
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 删除申请流程
 * DELETE /api/application-flows/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM application_flows WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
