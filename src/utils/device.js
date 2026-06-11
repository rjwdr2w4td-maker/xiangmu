export function isMobile() {
  if (typeof window === 'undefined') return false
  const userAgent = navigator.userAgent.toLowerCase()
  const mobileKeywords = [
    'android',
    'iphone',
    'ipad',
    'ipod',
    'windows phone',
    'mobile',
    'blackberry'
  ]
  return mobileKeywords.some(keyword => userAgent.includes(keyword))
}

export function getEntryType() {
  if (typeof window === 'undefined') return null
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('entry')
}

export function redirectByDevice() {
  if (typeof window === 'undefined') return
  
  const isMobileDevice = isMobile()
  const entryType = getEntryType()
  const currentPath = window.location.pathname
  
  if (isMobileDevice && entryType && !currentPath.startsWith('/mobile')) {
    const basePath = import.meta.env.BASE_URL
    const mobilePath = `${basePath}mobile/${entryType}`
    window.location.href = mobilePath
  }
}
