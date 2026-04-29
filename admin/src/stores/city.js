import { defineStore } from 'pinia'
import { getCities } from '@/api'

export const useCityStore = defineStore('adminCity', {
  state: () => ({
    cities: [],
    currentCity: null
  }),

  actions: {
    async fetchCities() {
      try {
        this.cities = await getCities()
        if (this.cities.length > 0 && !this.currentCity) {
          const saved = localStorage.getItem('adminCurrentCity')
          if (saved) {
            const savedCity = JSON.parse(saved)
            const city = this.cities.find(c => c.id === savedCity.id)
            this.currentCity = city || this.cities[0]
          } else {
            this.currentCity = this.cities[0]
          }
        }
      } catch (error) {
        console.error('获取城市列表失败:', error)
      }
    },

    setCurrentCity(city) {
      this.currentCity = city
      localStorage.setItem('adminCurrentCity', JSON.stringify(city))
    }
  }
})
