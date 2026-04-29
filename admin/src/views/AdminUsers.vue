<template>
  <div class="admin-users">
    <div class="header">
      <h2>账号管理</h2>
      <el-button type="primary" @click="handleAdd">新增账号</el-button>
    </div>

    <el-table :data="users" border style="width: 100%">
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="role" label="角色" width="120">
        <template #default="{ row }">
          <el-tag :type="row.role === 'super_admin' ? 'danger' : 'primary'">
            {{ row.role === 'super_admin' ? '超级管理员' : '普通管理员' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="管理城市" min-width="200">
        <template #default="{ row }">
          <span v-if="row.role === 'super_admin'">全部城市</span>
          <el-tag
            v-else
            v-for="city in row.cities"
            :key="city"
            style="margin-right: 5px"
          >
            {{ city }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(row)"
            :disabled="row.role === 'super_admin'"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            :placeholder="isEdit ? '不修改请留空' : '请输入密码'"
          />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" style="width: 100%">
            <el-option label="普通管理员" value="admin" />
            <el-option label="超级管理员" value="super_admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="管理城市" prop="cities" v-if="form.role === 'admin'">
          <el-select
            v-model="form.cities"
            multiple
            placeholder="请选择城市"
            style="width: 100%"
          >
            <el-option
              v-for="city in availableCities"
              :key="city"
              :label="city"
              :value="city"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from 'axios';

export default {
  name: 'AdminUsers',
  setup() {
    const users = ref([]);
    const dialogVisible = ref(false);
    const formRef = ref(null);
    const submitting = ref(false);
    const isEdit = ref(false);
    const currentId = ref(null);

    const availableCities = ref([]);

    const form = reactive({
      username: '',
      password: '',
      role: 'admin',
      cities: []
    });

    const formRules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
      ],
      password: [
        {
          validator: (rule, value, callback) => {
            if (!isEdit.value && !value) {
              callback(new Error('请输入密码'));
            } else if (value && value.length < 6) {
              callback(new Error('密码至少6位'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }
      ],
      role: [
        { required: true, message: '请选择角色', trigger: 'change' }
      ],
      cities: [
        {
          validator: (rule, value, callback) => {
            if (form.role === 'admin' && (!value || value.length === 0)) {
              callback(new Error('请至少选择一个城市'));
            } else {
              callback();
            }
          },
          trigger: 'change'
        }
      ]
    };

    const dialogTitle = computed(() => {
      return isEdit.value ? '编辑账号' : '新增账号';
    });

    const fetchCities = async () => {
      try {
        const response = await axios.get('/api/cities');
        availableCities.value = response.data.data.map(city => city.name);
      } catch (error) {
        console.error('获取城市列表失败', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/admin');
        users.value = response.data.data;
      } catch (error) {
        ElMessage.error('获取用户列表失败');
      }
    };

    const handleAdd = () => {
      isEdit.value = false;
      currentId.value = null;
      Object.assign(form, {
        username: '',
        password: '',
        role: 'admin',
        cities: []
      });
      dialogVisible.value = true;
    };

    const handleEdit = (row) => {
      isEdit.value = true;
      currentId.value = row.id;
      Object.assign(form, {
        username: row.username,
        password: '',
        role: row.role,
        cities: row.cities || []
      });
      dialogVisible.value = true;
    };

    const handleSubmit = async () => {
      if (!formRef.value) return;

      await formRef.value.validate(async (valid) => {
        if (!valid) return;

        submitting.value = true;
        try {
          const data = { ...form };
          if (data.role === 'super_admin') {
            data.cities = [];
          }
          if (isEdit.value && !data.password) {
            delete data.password;
          }

          if (isEdit.value) {
            await axios.put(`/api/admin/${currentId.value}`, data);
            ElMessage.success('更新成功');
          } else {
            await axios.post('/api/admin', data);
            ElMessage.success('创建成功');
          }

          dialogVisible.value = false;
          fetchUsers();
        } catch (error) {
          ElMessage.error(error.response?.data?.message || '操作失败');
        } finally {
          submitting.value = false;
        }
      });
    };

    const handleDelete = async (row) => {
      try {
        await ElMessageBox.confirm(
          `确定要删除用户 "${row.username}" 吗？`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );

        await axios.delete(`/api/admin/${row.id}`);
        ElMessage.success('删除成功');
        fetchUsers();
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败');
        }
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN');
    };

    onMounted(() => {
      fetchCities();
      fetchUsers();
    });

    return {
      users,
      dialogVisible,
      dialogTitle,
      form,
      formRules,
      formRef,
      submitting,
      isEdit,
      availableCities,
      fetchCities,
      handleAdd,
      handleEdit,
      handleSubmit,
      handleDelete,
      formatDate
    };
  }
};
</script>

<style scoped>
.admin-users {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
}
</style>
