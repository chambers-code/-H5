<template>
  <div id="app">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="logo">康力元集团</div>
      <div class="city-selector" @click="showCityPicker = true">
        <van-icon name="location-o" />
        {{ currentCity?.name || '选择城市' }}
        <van-icon name="arrow-down" />
      </div>
    </div>

    <!-- Tab导航 -->
    <van-tabs v-model:active="activeTab" @change="onTabChange" color="#1890ff" title-active-color="#1890ff">
      <van-tab title="政策介绍" name="policy"></van-tab>
      <van-tab title="产品介绍" name="product"></van-tab>
      <van-tab title="公司介绍" name="company"></van-tab>
    </van-tabs>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <router-view />
    </div>

    <!-- 城市选择弹窗 -->
    <van-popup v-model:show="showCityPicker" position="bottom" round>
      <van-picker
        :columns="cityColumns"
        @confirm="onCityConfirm"
        @cancel="showCityPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCityStore } from '@/stores/city'

const router = useRouter()
const route = useRoute()
const cityStore = useCityStore()

const activeTab = ref('policy')
const showCityPicker = ref(false)

const currentCity = computed(() => cityStore.currentCity)
const cityColumns = computed(() =>
  cityStore.cities.map(city => ({ text: city.name, value: city.id, city }))
)

const onTabChange = (name) => {
  const routes = {
    policy: '/policy',
    product: '/product',
    company: '/company'
  }
  router.push(routes[name])
}

const onCityConfirm = ({ selectedOptions }) => {
  cityStore.setCurrentCity(selectedOptions[0].city)
  showCityPicker.value = false
  router.go(0)
}

watch(() => route.path, (path) => {
  if (path.startsWith('/policy')) activeTab.value = 'policy'
  else if (path.startsWith('/product')) activeTab.value = 'product'
  else if (path.startsWith('/company')) activeTab.value = 'company'
}, { immediate: true })

onMounted(async () => {
  cityStore.loadCurrentCity()
  await cityStore.fetchCities()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.top-nav {
  background: linear-gradient(135deg, #1890ff 0%, #0d6efd 100%);
  color: white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 999;
}

.logo {
  font-size: 18px;
  font-weight: bold;
}

.city-selector {
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  cursor: pointer;
}

.content-wrapper {
  padding: 16px;
  padding-bottom: 32px;
}

.van-tabs__nav {
  background: white;
}

.van-tab {
  font-size: 16px;
  font-weight: 500;
}
</style>
