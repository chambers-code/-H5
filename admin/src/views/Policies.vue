<template>
  <div>
    <el-select v-model="selectedCity" placeholder="选择城市" style="margin-bottom: 20px" @change="fetchData">
      <el-option
        v-for="city in filteredCities"
        :key="city.id"
        :label="city.name"
        :value="city.id"
      />
    </el-select>

    <el-button type="primary" @click="handleAdd" :disabled="!selectedCity">添加政策</el-button>

    <el-table :data="tableData" style="width: 100%; margin-top: 20px" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="sort_order" label="排序" width="100" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" :rows="6" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            action="/api/upload/single"
            list-type="picture-card"
            :file-list="fileList"
            :on-success="handleUploadSuccess"
            :on-remove="handleRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort_order" :min="0" />
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
import { getCities, getPolicies, createPolicy, updatePolicy, deletePolicy } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const cities = ref([])
const selectedCity = ref(null)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加政策')
const form = ref({
  city_id: null,
  title: '',
  content: '',
  images: [],
  sort_order: 0
})
const fileList = ref([])
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

// 过滤后的城市列表
const filteredCities = computed(() => {
  if (isSuperAdmin.value) {
    return cities.value
  }
  return cities.value.filter(city =>
    allowedCities.value.includes(city.name)
  )
})

const fetchCities = async () => {
  try {
    cities.value = await getCities()
    if (filteredCities.value.length > 0) {
      selectedCity.value = filteredCities.value[0].id
      fetchData()
    }
  } catch (error) {
    console.error('获取城市列表失败:', error)
  }
}

const fetchData = async () => {
  if (!selectedCity.value) return
  try {
    tableData.value = await getPolicies(selectedCity.value)
  } catch (error) {
    console.error('获取政策列表失败:', error)
  }
}

const handleAdd = () => {
  dialogTitle.value = '添加政策'
  editingId.value = null
  form.value = {
    city_id: selectedCity.value,
    title: '',
    content: '',
    images: [],
    sort_order: 0
  }
  fileList.value = []
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑政策'
  editingId.value = row.id
  form.value = { ...row }
  fileList.value = (row.images || []).map((url, index) => ({
    name: `image-${index}`,
    url
  }))
  dialogVisible.value = true
}

const handleUploadSuccess = (response) => {
  if (response.success) {
    form.value.images.push(response.data.url)
  }
}

const handleRemove = (file) => {
  const index = form.value.images.indexOf(file.url)
  if (index > -1) {
    form.value.images.splice(index, 1)
  }
}

const handleSubmit = async () => {
  try {
    if (editingId.value) {
      await updatePolicy(editingId.value, form.value)
      ElMessage.success('更新成功')
    } else {
      await createPolicy(form.value)
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
    await ElMessageBox.confirm('确定要删除这条政策吗？', '提示', {
      type: 'warning'
    })
    await deletePolicy(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

onMounted(() => {
  fetchCities()
})
</script>
