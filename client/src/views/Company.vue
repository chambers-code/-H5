<template>
  <div class="company-page">
    <!-- 公司介绍卡片 -->
    <div class="card">
      <div class="card-title">
        <div class="title-bar"></div>
        <span>公司介绍</span>
      </div>
      <div class="card-content">
        <p v-if="companyIntros.length > 0">{{ companyIntros[0].content }}</p>
        <p v-else>暂无公司介绍</p>
      </div>
    </div>

    <!-- 站点位置卡片 -->
    <div class="card">
      <div class="card-title">
        <div class="title-bar"></div>
        <span>站点位置</span>
      </div>
      <div class="location-list">
        <div v-for="location in locations" :key="location.id" class="location-item">
          <div class="location-name">{{ location.name }}</div>
          <div class="location-address">{{ location.address }}</div>
          <a v-if="location.phone" :href="`tel:${location.phone}`" class="location-phone">
            {{ location.phone }}
          </a>
          <div v-if="location.business_hours" class="location-hours">
            {{ location.business_hours }}
          </div>
        </div>
        <van-empty v-if="locations.length === 0" description="暂无站点信息" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getCompanyIntros, getSiteLocations } from '@/api'
import { useCityStore } from '@/stores/city'

const cityStore = useCityStore()
const companyIntros = ref([])
const locations = ref([])

const currentCityId = computed(() => cityStore.currentCity?.id)

const fetchData = async () => {
  if (!currentCityId.value) return
  try {
    companyIntros.value = await getCompanyIntros(currentCityId.value)
    locations.value = await getSiteLocations(currentCityId.value)
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.company-page {
  padding-bottom: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.title-bar {
  width: 4px;
  height: 20px;
  background: #1890ff;
  border-radius: 2px;
}

.card-content {
  font-size: 14px;
  line-height: 1.8;
  color: #666;
}

.location-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.location-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.location-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.location-address {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
}

.location-phone {
  display: inline-block;
  font-size: 14px;
  color: #1890ff;
  text-decoration: none;
  margin-bottom: 8px;
}

.location-hours {
  font-size: 14px;
  color: #999;
}
</style>
