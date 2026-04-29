import { defineStore } from 'pinia'
import { getCities } from '@/api'

export const useCityStore = defineStore('city', {
  state: () => ({
    cities: [],
    currentCity: null
  }),

  actions: {
    async fetchCities() {
      try {
        this.cities = await getCities()
        if (this.cities.length > 0 && !this.currentCity) {
          this.currentCity = this.cities[0]
        }
      } catch (error) {
        console.error('获取城市列表失败:', error)
      }
    },

    setCurrentCity(city) {
      this.currentCity = city
      localStorage.setItem('currentCity', JSON.stringify(city))
    },

    loadCurrentCity() {
      const saved = localStorage.getItem('currentCity')
      if (saved) {
        this.currentCity = JSON.parse(saved)
      }
    }
  }
})
