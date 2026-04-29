/**
 * 权限工具函数
 */

/**
 * 获取当前登录用户信息
 */
export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem('admin_user')
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    return null
  }
}

/**
 * 检查是否为超级管理员
 */
export function isSuperAdmin() {
  const user = getCurrentUser()
  return user?.role === 'super_admin'
}

/**
 * 获取用户可管理的城市列表
 */
export function getAllowedCities() {
  if (isSuperAdmin()) {
    return null // 超级管理员可以管理所有城市
  }
  const user = getCurrentUser()
  return user?.cities || []
}

/**
 * 检查是否可以管理指定城市
 * @param {string} cityName - 城市名称
 */
export function canManageCity(cityName) {
  if (isSuperAdmin()) {
    return true
  }
  const allowedCities = getAllowedCities()
  return allowedCities.includes(cityName)
}

/**
 * 过滤城市列表，只返回用户可管理的城市
 * @param {Array} cities - 完整的城市列表
 */
export function filterCitiesByPermission(cities) {
  if (isSuperAdmin()) {
    return cities
  }
  const allowedCities = getAllowedCities()
  return cities.filter(city => allowedCities.includes(city.name))
}
