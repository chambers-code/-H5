const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

/**
 * 中间件配置
 */
// 跨域配置
app.use(cors());
// JSON解析
app.use(bodyParser.json());
// URL编码解析
app.use(bodyParser.urlencoded({ extended: true }));
// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/**
 * API路由配置
 */
app.use('/api/admin', require('./routes/adminUsers'));
app.use('/api/cities', require('./routes/cities'));
app.use('/api/policies', require('./routes/policies'));
app.use('/api/application-flows', require('./routes/applicationFlows'));
app.use('/api/product-intros', require('./routes/productIntros'));
app.use('/api/hot-products', require('./routes/hotProducts'));
app.use('/api/product-videos', require('./routes/productVideos'));
app.use('/api/company-intros', require('./routes/companyIntros'));
app.use('/api/site-locations', require('./routes/siteLocations'));
app.use('/api/upload', require('./routes/upload'));

/**
 * 健康检查接口
 * GET /health
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '服务运行正常' });
});

/**
 * 全局错误处理中间件
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || '服务器错误'
  });
});

/**
 * 启动服务器
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
