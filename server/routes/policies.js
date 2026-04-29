const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * 获取政策列表
 * GET /api/policies?city_id=xxx
 */
router.get('/', async (req, res) => {
  try {
    const { city_id } = req.query;
    let query = 'SELECT * FROM policies WHERE status = 1';
    const params = [];

    if (city_id) {
      query += ' AND city_id = ?';
      params.push(city_id);
    }

    query += ' ORDER BY sort_order ASC';
    const [rows] = await db.query(query, params);

    // 解析JSON字段
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
 * 根据ID获取单个政策详情
 * GET /api/policies/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM policies WHERE id = ? AND status = 1',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '政策不存在' });
    }

    const policy = rows[0];
    if (policy.images) {
      try {
        policy.images = JSON.parse(policy.images);
      } catch (e) {
        policy.images = [];
      }
    }

    res.json({ success: true, data: policy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 创建新政策
 * POST /api/policies
 */
router.post('/', async (req, res) => {
  try {
    const { city_id, title, content, images, sort_order } = req.body;
    const imagesJson = images ? JSON.stringify(images) : null;

    const [result] = await db.query(
      'INSERT INTO policies (city_id, title, content, images, sort_order) VALUES (?, ?, ?, ?, ?)',
      [city_id, title, content, imagesJson, sort_order || 0]
    );
    res.json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 更新政策信息
 * PUT /api/policies/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { city_id, title, content, images, sort_order, status } = req.body;
    const imagesJson = images ? JSON.stringify(images) : null;

    await db.query(
      'UPDATE policies SET city_id = ?, title = ?, content = ?, images = ?, sort_order = ?, status = ? WHERE id = ?',
      [city_id, title, content, imagesJson, sort_order, status, req.params.id]
    );
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 删除政策
 * DELETE /api/policies/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM policies WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
