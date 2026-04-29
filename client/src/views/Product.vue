<template>
  <div class="product-page">
    <!-- 产品介绍卡片 -->
    <div class="card">
      <div class="card-title">
        <div class="title-bar"></div>
        <span>产品介绍</span>
      </div>
      <div class="card-content">
        <p v-if="productIntros.length > 0">{{ productIntros[0].content }}</p>
        <p v-else>暂无产品介绍</p>
      </div>
    </div>

    <!-- 热门产品卡片 -->
    <div class="card">
      <div class="card-title">
        <div class="title-bar"></div>
        <span>热门产品</span>
      </div>
      <div class="product-list">
        <div v-for="product in hotProducts" :key="product.id" class="product-item">
          <div class="product-image">
            <van-image
              v-if="product.cover_image"
              :src="product.cover_image"
              fit="cover"
              width="100"
              height="100"
            >
              <template #loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
            <div v-else class="placeholder-image">
              <van-icon name="photo-o" size="40" color="#ccc" />
            </div>
          </div>
          <div class="product-info">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-desc">{{ product.description }}</div>
          </div>
        </div>
        <van-empty v-if="hotProducts.length === 0" description="暂无热门产品" />
      </div>
    </div>

    <!-- 产品视频卡片 -->
    <div class="card">
      <div class="card-title">
        <div class="title-bar"></div>
        <span>产品视频</span>
      </div>
      <div class="video-list">
        <div v-for="video in videos" :key="video.id" class="video-item" @click="playVideo(video)">
          <div class="video-cover">
            <van-image
              v-if="video.cover_image"
              :src="video.cover_image"
              fit="cover"
              width="100%"
              height="180"
            >
              <template #loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
            <div v-else class="placeholder-video">
              <van-icon name="video-o" size="60" color="#ccc" />
            </div>
            <div class="play-icon">
              <van-icon name="play-circle-o" size="50" color="white" />
            </div>
          </div>
          <div class="video-title">{{ video.title }}</div>
        </div>
        <van-empty v-if="videos.length === 0" description="暂无产品视频" />
      </div>
    </div>

    <!-- 视频播放弹窗 -->
    <van-popup
      v-model:show="showVideoPlayer"
      position="center"
      :style="{ width: '90%', borderRadius: '8px' }"
    >
      <div class="video-player">
        <video
          v-if="currentVideo"
          :src="currentVideo.video_url"
          controls
          autoplay
          style="width: 100%; border-radius: 8px;"
        />
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getProductIntros, getHotProducts, getProductVideos } from '@/api'
import { useCityStore } from '@/stores/city'

const cityStore = useCityStore()
const productIntros = ref([])
const hotProducts = ref([])
const videos = ref([])
const showVideoPlayer = ref(false)
const currentVideo = ref(null)

const currentCityId = computed(() => cityStore.currentCity?.id)

const fetchData = async () => {
  if (!currentCityId.value) return
  try {
    productIntros.value = await getProductIntros(currentCityId.value)
    hotProducts.value = await getHotProducts(currentCityId.value)
    videos.value = await getProductVideos(currentCityId.value)
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

const playVideo = (video) => {
  currentVideo.value = video
  showVideoPlayer.value = true
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.product-page {
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

.product-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-item {
  display: flex;
  gap: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.product-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f0f0f0;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.product-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.video-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.video-item {
  cursor: pointer;
}

.video-cover {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
}

.placeholder-video {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.9;
}

.video-title {
  margin-top: 8px;
  font-size: 14px;
  color: #333;
}

.video-player {
  padding: 10px;
}
</style>
