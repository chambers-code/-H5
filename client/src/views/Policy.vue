<template>
  <div class="policy-page">
    <!-- 政策介绍卡片 -->
    <div class="card">
      <div class="card-title">
        <div class="title-bar"></div>
        <span>政策介绍</span>
      </div>
      <div class="card-content">
        <p v-if="policyList.length > 0">{{ policyList[0].content }}</p>
        <p v-else>暂无政策信息</p>
      </div>
    </div>

    <!-- 申请流程卡片 -->
    <div class="card">
      <div class="card-title">
        <div class="title-bar"></div>
        <span>申请流程</span>
      </div>
      <div class="flow-list">
        <div v-for="flow in flowList" :key="flow.id" class="flow-item">
          <div class="flow-number">{{ flow.step_number }}</div>
          <div class="flow-content">
            <div class="flow-title">{{ flow.title }}</div>
            <div class="flow-desc">{{ flow.content }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 立即申请按钮 -->
    <div class="apply-button" @click="handleApply">
      立即申请
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getPolicies, getApplicationFlows } from '@/api'
import { useCityStore } from '@/stores/city'
import { showToast } from 'vant'

const cityStore = useCityStore()
const policyList = ref([])
const flowList = ref([])

const currentCityId = computed(() => cityStore.currentCity?.id)

const fetchData = async () => {
  if (!currentCityId.value) return
  try {
    policyList.value = await getPolicies(currentCityId.value)
    flowList.value = await getApplicationFlows(currentCityId.value)
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

const handleApply = () => {
  showToast('申请功能开发中')
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.policy-page {
  padding-bottom: 80px;
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

.flow-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.flow-item {
  display: flex;
  gap: 16px;
}

.flow-number {
  width: 36px;
  height: 36px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  flex-shrink: 0;
}

.flow-content {
  flex: 1;
}

.flow-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.flow-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.apply-button {
  position: fixed;
  bottom: 20px;
  left: 16px;
  right: 16px;
  background: #1890ff;
  color: white;
  text-align: center;
  padding: 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.apply-button:active {
  background: #0d6efd;
}
</style>
