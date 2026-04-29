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

    <el-button type="primary" @click="handleAdd" :disabled="!selectedCity">添加流程步骤</el-button>

    <el-table :data="tableData" style="width: 100%; margin-top: 20px" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="step_number" label="步骤序号" width="100" />
      <el-table-column prop="title" label="步骤标题" />
      <el-table-column prop="content" label="步骤内容" show-overflow-tooltip />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="步骤序号">
          <el-input-number v-model="form.step_number" :min="1" />
        </el-form-item>
        <el-form-item label="步骤标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="步骤内容">
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
import { getCities, getApplicationFlows, createApplicationFlow, updateApplicationFlow, deleteApplicationFlow } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { isSuperAdmin, filterCitiesByPermission } from '@/utils/permission'

const cities = ref([])
const selectedCity = ref(null)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加流程步骤')
const form = ref({
  city_id: null,
  step_number: 1,
  title: '',
  content: '',
  images: []
})
const fileList = ref([])
const editingId = ref(null)

// 过滤后的城市列表
const filteredCities = computed(() => {
  return filterCitiesByPermission(cities.value)
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
    tableData.value = await getApplicationFlows(selectedCity.value)
  } catch (error) {
    console.error('获取申请流程失败:', error)
  }
}

const handleAdd = () => {
  dialogTitle.value = '添加流程步骤'
  editingId.value = null
  form.value = {
    city_id: selectedCity.value,
    step_number: tableData.value.length + 1,
    title: '',
    content: '',
    images: []
  }
  fileList.value = []
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑流程步骤'
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
      await updateApplicationFlow(editingId.value, form.value)
      ElMessage.success('更新成功')
    } else {
      await createApplicationFlow(form.value)
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
    await ElMessageBox.confirm('确定要删除这个流程步骤吗？', '提示', {
      type: 'warning'
    })
    await deleteApplicationFlow(row.id)
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
