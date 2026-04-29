<template>
  <div>
    <el-button
      type="primary"
      @click="handleAdd"
      :disabled="!isSuperAdmin"
    >
      添加城市
    </el-button>

    <el-table :data="filteredTableData" style="width: 100%; margin-top: 20px" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="城市名称" />
      <el-table-column prop="code" label="城市编码" />
      <el-table-column prop="sort_order" label="排序" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button
            size="small"
            @click="handleEdit(row)"
            :disabled="!canManageCity(row.name)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(row)"
            :disabled="!canManageCity(row.name)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="城市名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="城市编码">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort_order" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getCities, createCity, updateCity, deleteCity } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加城市')
const form = ref({
  name: '',
  code: '',
  sort_order: 0,
  status: 1
})
const editingId = ref(null)

// 获取当前用户信息
const currentUser = computed(() => {
  try {
    const userStr = localStorage.getItem('admin_user')
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    return null
  }
})

// 检查是否为超级管理员
const isSuperAdmin = computed(() => {
  return currentUser.value?.role === 'super_admin'
})

// 获取用户可管理的城市列表
const allowedCities = computed(() => {
  if (isSuperAdmin.value) {
    return null // 超级管理员可以看到所有城市
  }
  return currentUser.value?.cities || []
})

// 过滤后的表格数据
const filteredTableData = computed(() => {
  if (isSuperAdmin.value) {
    return tableData.value
  }
  // 普通管理员只能看到自己管理的城市
  return tableData.value.filter(city =>
    allowedCities.value.includes(city.name)
  )
})

const fetchData = async () => {
  try {
    tableData.value = await getCities()
  } catch (error) {
    console.error('获取城市列表失败:', error)
  }
}

// 检查是否可以管理某个城市
const canManageCity = (cityName) => {
  if (isSuperAdmin.value) {
    return true
  }
  return allowedCities.value.includes(cityName)
}

const handleAdd = () => {
  dialogTitle.value = '添加城市'
  editingId.value = null
  form.value = {
    name: '',
    code: '',
    sort_order: 0,
    status: 1
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑城市'
  editingId.value = row.id
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    if (editingId.value) {
      await updateCity(editingId.value, form.value)
      ElMessage.success('更新成功')
    } else {
      await createCity(form.value)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('操作失败:', error)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这个城市吗？', '提示', {
      type: 'warning'
    })
    await deleteCity(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

onMounted(() => {
  fetchData()
})
</script>
