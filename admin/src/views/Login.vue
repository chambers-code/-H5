<template>
  <div class="login-container">
    <div class="login-box">
      <h2>管理后台登录</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="el-icon-user"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="el-icon-lock"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleLogin"
            style="width: 100%"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import axios from 'axios';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const loginFormRef = ref(null);
    const loading = ref(false);

    const loginForm = reactive({
      username: '',
      password: ''
    });

    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    };

    const handleLogin = async () => {
      if (!loginFormRef.value) return;

      await loginFormRef.value.validate(async (valid) => {
        if (!valid) return;

        loading.value = true;
        try {
          const response = await axios.post('/api/admin/login', loginForm);
          const { token, user } = response.data.data;

          localStorage.setItem('admin_token', token);
          localStorage.setItem('admin_user', JSON.stringify(user));

          ElMessage.success('登录成功');
          router.push('/');
        } catch (error) {
          ElMessage.error(error.response?.data?.message || '登录失败');
        } finally {
          loading.value = false;
        }
      });
    };

    return {
      loginForm,
      rules,
      loginFormRef,
      loading,
      handleLogin
    };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.login-box h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}
</style>
