import request from '@/utils/request'

export const getCities = () => {
  return request.get('/cities')
}

export const createCity = (data) => {
  return request.post('/cities', data)
}

export const updateCity = (id, data) => {
  return request.put(`/cities/${id}`, data)
}

export const deleteCity = (id) => {
  return request.delete(`/cities/${id}`)
}

export const getPolicies = (cityId) => {
  return request.get('/policies', { params: { city_id: cityId } })
}

export const createPolicy = (data) => {
  return request.post('/policies', data)
}

export const updatePolicy = (id, data) => {
  return request.put(`/policies/${id}`, data)
}

export const deletePolicy = (id) => {
  return request.delete(`/policies/${id}`)
}

export const getApplicationFlows = (cityId) => {
  return request.get('/application-flows', { params: { city_id: cityId } })
}

export const createApplicationFlow = (data) => {
  return request.post('/application-flows', data)
}

export const updateApplicationFlow = (id, data) => {
  return request.put(`/application-flows/${id}`, data)
}

export const deleteApplicationFlow = (id) => {
  return request.delete(`/application-flows/${id}`)
}

export const getProductIntros = (cityId) => {
  return request.get('/product-intros', { params: { city_id: cityId } })
}

export const createProductIntro = (data) => {
  return request.post('/product-intros', data)
}

export const updateProductIntro = (id, data) => {
  return request.put(`/product-intros/${id}`, data)
}

export const deleteProductIntro = (id) => {
  return request.delete(`/product-intros/${id}`)
}

export const getHotProducts = (cityId) => {
  return request.get('/hot-products', { params: { city_id: cityId } })
}

export const createHotProduct = (data) => {
  return request.post('/hot-products', data)
}

export const updateHotProduct = (id, data) => {
  return request.put(`/hot-products/${id}`, data)
}

export const deleteHotProduct = (id) => {
  return request.delete(`/hot-products/${id}`)
}

export const getProductVideos = (cityId) => {
  return request.get('/product-videos', { params: { city_id: cityId } })
}

export const createProductVideo = (data) => {
  return request.post('/product-videos', data)
}

export const updateProductVideo = (id, data) => {
  return request.put(`/product-videos/${id}`, data)
}

export const deleteProductVideo = (id) => {
  return request.delete(`/product-videos/${id}`)
}

export const getCompanyIntros = (cityId) => {
  return request.get('/company-intros', { params: { city_id: cityId } })
}

export const createCompanyIntro = (data) => {
  return request.post('/company-intros', data)
}

export const updateCompanyIntro = (id, data) => {
  return request.put(`/company-intros/${id}`, data)
}

export const deleteCompanyIntro = (id) => {
  return request.delete(`/company-intros/${id}`)
}

export const getSiteLocations = (cityId) => {
  return request.get('/site-locations', { params: { city_id: cityId } })
}

export const createSiteLocation = (data) => {
  return request.post('/site-locations', data)
}

export const updateSiteLocation = (id, data) => {
  return request.put(`/site-locations/${id}`, data)
}

export const deleteSiteLocation = (id) => {
  return request.delete(`/site-locations/${id}`)
}

export const uploadFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/upload/single', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
