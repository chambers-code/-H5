import request from '@/utils/request'

export const getCities = () => {
  return request.get('/cities')
}

export const getPolicies = (cityId) => {
  return request.get('/policies', { params: { city_id: cityId } })
}

export const getApplicationFlows = (cityId) => {
  return request.get('/application-flows', { params: { city_id: cityId } })
}

export const getProductIntros = (cityId) => {
  return request.get('/product-intros', { params: { city_id: cityId } })
}

export const getHotProducts = (cityId) => {
  return request.get('/hot-products', { params: { city_id: cityId } })
}

export const getProductVideos = (cityId) => {
  return request.get('/product-videos', { params: { city_id: cityId } })
}

export const getCompanyIntros = (cityId) => {
  return request.get('/company-intros', { params: { city_id: cityId } })
}

export const getSiteLocations = (cityId) => {
  return request.get('/site-locations', { params: { city_id: cityId } })
}
