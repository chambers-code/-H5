const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * 获取所有城市列表
 * GET /api/cities
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM cities WHERE status = 1 ORDER BY sort_order ASC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 根据ID获取单个城市信息
 * GET /api/cities/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM cities WHERE id = ? AND status = 1',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '城市不存在' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 创建新城市
 * POST /api/cities
 */
router.post('/', async (req, res) => {
  try {
    const { name, code, sort_order } = req.body;
    const [result] = await db.query(
      'INSERT INTO cities (name, code, sort_order) VALUES (?, ?, ?)',
      [name, code, sort_order || 0]
    );
    res.json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 更新城市信息
 * PUT /api/cities/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { name, code, sort_order, status } = req.body;
    await db.query(
      'UPDATE cities SET name = ?, code = ?, sort_order = ?, status = ? WHERE id = ?',
      [name, code, sort_order, status, req.params.id]
    );
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 删除城市
 * DELETE /api/cities/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM cities WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
