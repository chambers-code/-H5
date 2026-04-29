const bcrypt = require('bcryptjs');

// 生成密码哈希
async function generatePasswordHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);

  console.log('密码:', password);
  console.log('哈希:', hash);
  console.log('\n请将此哈希值复制到 migrations/create_admin_users.sql 文件中');
}

generatePasswordHash();
