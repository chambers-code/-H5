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

    <el-button type="primary" @click="handleAdd" :disabled="!selectedCity">添加产品视频</el-button>

    <el-table :data="tableData" style="width: 100%; margin-top: 20px" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="封面" width="100">
        <template #default="{ row }">
          <el-image v-if="row.cover_image" :src="row.cover_image" style="width: 60px; height: 60px" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="视频标题" />
      <el-table-column prop="description" label="视频描述" show-overflow-tooltip />
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
        <el-form-item label="视频标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="视频地址">
          <el-input v-model="form.video_url" placeholder="请输入视频URL" />
        </el-form-item>
        <el-form-item label="封面图片">
          <el-upload
            action="/api/upload/single"
            list-type="picture-card"
            :limit="1"
            :file-list="coverFileList"
            :on-success="handleCoverUploadSuccess"
            :on-remove="handleCoverRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="视频描述">
          <el-input v-model="form.description" type="textarea" :rows="4" />
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
import { getCities, getProductVideos, createProductVideo, updateProductVideo, deleteProductVideo } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { filterCitiesByPermission } from '@/utils/permission'

const cities = ref([])
const selectedCity = ref(null)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加产品视频')
const form = ref({
  city_id: null,
  title: '',
  video_url: '',
  cover_image: '',
  description: '',
  sort_order: 0
})
const coverFileList = ref([])
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
    tableData.value = await getProductVideos(selectedCity.value)
  } catch (error) {
    console.error('获取产品视频失败:', error)
  }
}

const handleAdd = () => {
  dialogTitle.value = '添加产品视频'
  editingId.value = null
  form.value = {
    city_id: selectedCity.value,
    title: '',
    video_url: '',
    cover_image: '',
    description: '',
    sort_order: 0
  }
  coverFileList.value = []
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑产品视频'
  editingId.value = row.id
  form.value = { ...row }
  coverFileList.value = row.cover_image ? [{ name: 'cover', url: row.cover_image }] : []
  dialogVisible.value = true
}

const handleCoverUploadSuccess = (response) => {
  if (response.success) {
    form.value.cover_image = response.data.url
  }
}

const handleCoverRemove = () => {
  form.value.cover_image = ''
}

const handleSubmit = async () => {
  try {
    if (editingId.value) {
      await updateProductVideo(editingId.value, form.value)
      ElMessage.success('更新成功')
    } else {
      await createProductVideo(form.value)
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
    await ElMessageBox.confirm('确定要删除这个产品视频吗？', '提示', {
      type: 'warning'
    })
    await deleteProductVideo(row.id)
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
