export function notifyVisit() {
  if (typeof window === 'undefined') {
    return
  }

  const visitData = {
    path: window.location.pathname || '/',
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    referrer: document.referrer || 'direct',
  }

  console.log('[LOGGER] Отправляем данные визита:', visitData)

  fetch('http://localhost:3000/visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visitData),
  })
    .then((res) => {
      console.log('[LOGGER] ✅ Ответ от сервера:', res.status)
      return res.json()
    })
    .then((data) => {
      console.log('[LOGGER] Сервер ответил:', data)
    })
    .catch((error) => {
      console.error('[LOGGER] ❌ Ошибка отправки:', error)
    })
}
