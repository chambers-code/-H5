<template>
  <el-container style="height: 100vh">
    <el-aside width="200px" style="background-color: #304156">
      <div style="color: white; text-align: center; padding: 20px; font-size: 18px; font-weight: bold;">
        康力元管理后台
      </div>
      <el-menu
        :default-active="activeMenu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/cities">
          <el-icon><Location /></el-icon>
          <span>城市管理</span>
        </el-menu-item>
        <el-sub-menu index="policy">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>政策管理</span>
          </template>
          <el-menu-item index="/policies">政策介绍</el-menu-item>
          <el-menu-item index="/application-flows">申请流程</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="product">
          <template #title>
            <el-icon><ShoppingCart /></el-icon>
            <span>产品管理</span>
          </template>
          <el-menu-item index="/product-intros">产品介绍</el-menu-item>
          <el-menu-item index="/hot-products">热门产品</el-menu-item>
          <el-menu-item index="/product-videos">产品视频</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="company">
          <template #title>
            <el-icon><OfficeBuilding /></el-icon>
            <span>公司管理</span>
          </template>
          <el-menu-item index="/company-intros">公司介绍</el-menu-item>
          <el-menu-item index="/site-locations">站点位置</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/admin-users" v-if="isSuperAdmin">
          <el-icon><User /></el-icon>
          <span>账号管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="background-color: #fff; box-shadow: 0 1px 4px rgba(0,21,41,.08)">
        <div style="display: flex; justify-content: space-between; align-items: center; height: 100%;">
          <h2>{{ pageTitle }}</h2>
          <div style="display: flex; align-items: center; gap: 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="color: #666;">当前城市：</span>
              <el-select v-model="currentCityId" placeholder="选择城市" style="width: 150px" @change="onCityChange">
                <el-option
                  v-for="city in cities"
                  :key="city.id"
                  :label="city.name"
                  :value="city.id"
                />
              </el-select>
            </div>
            <el-dropdown @command="handleCommand">
              <span style="cursor: pointer; color: #409EFF;">
                <el-icon><User /></el-icon>
                {{ currentUser?.username }}
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item disabled>
                    {{ isSuperAdmin ? '超级管理员' : '普通管理员' }}
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>

      <el-main style="background-color: #f0f2f5">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCityStore } from '@/stores/city'
import { ElMessageBox } from 'element-plus'
import { isSuperAdmin as checkSuperAdmin, getCurrentUser } from '@/utils/permission'

const route = useRoute()
const router = useRouter()
const cityStore = useCityStore()

const activeMenu = computed(() => route.path)
const cities = computed(() => cityStore.cities)
const currentCityId = computed({
  get: () => cityStore.currentCity?.id,
  set: (id) => {
    const city = cityStore.cities.find(c => c.id === id)
    if (city) {
      cityStore.setCurrentCity(city)
    }
  }
})

const currentUser = computed(() => getCurrentUser())
const isSuperAdmin = computed(() => checkSuperAdmin())

const onCityChange = () => {
  window.location.reload()
}

const handleCommand = async (command) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      router.push('/login')
    } catch (error) {
      // 用户取消
    }
  }
}

const pageTitle = computed(() => {
  const titles = {
    '/cities': '城市管理',
    '/policies': '政策介绍管理',
    '/application-flows': '申请流程管理',
    '/product-intros': '产品介绍管理',
    '/hot-products': '热门产品管理',
    '/product-videos': '产品视频管理',
    '/company-intros': '公司介绍管理',
    '/site-locations': '站点位置管理',
    '/admin-users': '账号管理'
  }
  return titles[route.path] || '管理后台'
})

onMounted(() => {
  cityStore.fetchCities()
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
}
</style>
