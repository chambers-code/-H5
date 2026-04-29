const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { authMiddleware, superAdminMiddleware, generateToken } = require('../middleware/auth');

/**
 * 管理员登录接口
 * POST /api/admin/login
 * 不需要认证
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码不能为空'
      });
    }

    // 查询用户
    const [users] = await db.query(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    const user = users[0];

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 解析城市权限
    let cities = null;
    if (user.cities) {
      try {
        cities = JSON.parse(user.cities);
      } catch (error) {
        cities = [];
      }
    }

    // 生成 token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
      cities: cities
    });

    // 返回用户信息和 token
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          cities: cities
        }
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '登录失败'
    });
  }
});

/**
 * 获取管理员列表
 * GET /api/admin
 * 需要超级管理员权限
 */
router.get('/', authMiddleware, superAdminMiddleware, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, role, cities, created_at FROM admin_users ORDER BY created_at DESC'
    );

    // 解析 cities JSON
    const usersWithParsedCities = users.map(user => ({
      ...user,
      cities: user.cities ? JSON.parse(user.cities) : null
    }));

    res.json({
      success: true,
      data: usersWithParsedCities
    });
  } catch (error) {
    console.error('获取管理员列表错误:', error);
    res.status(500).json({
      success: false,
      message: '获取管理员列表失败'
    });
  }
});

/**
 * 创建管理员
 * POST /api/admin
 * 需要超级管理员权限
 */
router.post('/', authMiddleware, superAdminMiddleware, async (req, res) => {
  try {
    const { username, password, role, cities } = req.body;

    // 验证必填字段
    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: '用户名、密码和角色不能为空'
      });
    }

    // 验证角色
    if (!['super_admin', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: '角色必须是 super_admin 或 admin'
      });
    }

    // 验证普通管理员必须有城市权限
    if (role === 'admin' && (!cities || cities.length === 0)) {
      return res.status(400).json({
        success: false,
        message: '普通管理员必须分配至少一个城市'
      });
    }

    // 检查用户名是否已存在
    const [existing] = await db.query(
      'SELECT id FROM admin_users WHERE username = ?',
      [username]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 准备城市数据
    const citiesJson = role === 'super_admin' ? null : JSON.stringify(cities);

    // 插入新管理员
    const [result] = await db.query(
      'INSERT INTO admin_users (username, password, role, cities) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, role, citiesJson]
    );

    res.json({
      success: true,
      data: {
        id: result.insertId,
        username,
        role,
        cities: role === 'super_admin' ? null : cities
      }
    });
  } catch (error) {
    console.error('创建管理员错误:', error);
    res.status(500).json({
      success: false,
      message: '创建管理员失败'
    });
  }
});

/**
 * 更新管理员信息
 * PUT /api/admin/:id
 * 需要超级管理员权限
 */
router.put('/:id', authMiddleware, superAdminMiddleware, async (req, res) => {
  try {
    const adminId = req.params.id;
    const { password, role, cities } = req.body;

    // 检查管理员是否存在
    const [users] = await db.query(
      'SELECT * FROM admin_users WHERE id = ?',
      [adminId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '管理员不存在'
      });
    }

    const user = users[0];

    // 不允许修改超级管理员
    if (user.role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: '不能修改超级管理员'
      });
    }

    // 验证角色
    if (role && !['super_admin', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: '角色必须是 super_admin 或 admin'
      });
    }

    // 验证普通管理员必须有城市权限
    if (role === 'admin' && (!cities || cities.length === 0)) {
      return res.status(400).json({
        success: false,
        message: '普通管理员必须分配至少一个城市'
      });
    }

    // 准备更新数据
    let updateFields = [];
    let updateValues = [];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }

    if (role) {
      updateFields.push('role = ?');
      updateValues.push(role);
    }

    if (cities !== undefined) {
      const citiesJson = role === 'super_admin' ? null : JSON.stringify(cities);
      updateFields.push('cities = ?');
      updateValues.push(citiesJson);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有要更新的字段'
      });
    }

    updateValues.push(adminId);

    // 更新管理员
    await db.query(
      `UPDATE admin_users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: '更新成功'
    });
  } catch (error) {
    console.error('更新管理员错误:', error);
    res.status(500).json({
      success: false,
      message: '更新管理员失败'
    });
  }
});

/**
 * 删除管理员
 * DELETE /api/admin/:id
 * 需要超级管理员权限
 */
router.delete('/:id', authMiddleware, superAdminMiddleware, async (req, res) => {
  try {
    const adminId = req.params.id;

    // 检查管理员是否存在
    const [users] = await db.query(
      'SELECT role FROM admin_users WHERE id = ?',
      [adminId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '管理员不存在'
      });
    }

    // 不允许删除超级管理员
    if (users[0].role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: '不能删除超级管理员'
      });
    }

    // 删除管理员
    await db.query('DELETE FROM admin_users WHERE id = ?', [adminId]);

    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除管理员错误:', error);
    res.status(500).json({
      success: false,
      message: '删除管理员失败'
    });
  }
});

module.exports = router;
