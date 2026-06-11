// Вспомогательная функция для безопасного обрезания длинных строк (User-Agent, Path)
const truncate = (str, max = 50) => str && str.length > max ? `${str.substring(0, max)}...` : str;

export const startCommand = async (ctx) => {
  const message = `
👋 Добро пожаловать!

📋 Команды:
/stats - статистика визитов
/logs - последние логи
/visitors - подробные посетители
/help - справка
  `.trim()
  await ctx.reply(message)
}

export const statsCommand = async (ctx) => {
  try {
    const response = await fetch('http://localhost:3000/api/stats')
    if (!response.ok) throw new Error('API Error')
    
    const stats = await response.json()
    const uptimeSec = Math.floor(stats.uptime || 0)
    
    const message = `
📊 Статистика:
👥 Всего визитов: ${stats.totalVisits ?? 0}
🔄 Уникальных IP: ${stats.uniqueIPCount ?? 0}
⏰ Uptime: ${uptimeSec} сек
    `.trim()
    await ctx.reply(message)
  } catch (error) {
    await ctx.reply('❌ Ошибка получения статистики')
  }
}

export const logsCommand = async (ctx) => {
  try {
    const response = await fetch('http://localhost:3000/api/logs')
    if (!response.ok) throw new Error('API Error')
    
    const logs = await response.json()
    
    if (!logs || logs.length === 0) {
      await ctx.reply('📜 Логи пустые')
      return
    }

    // Берём последние 10 логов в хронологическом порядке
    const lastLogs = logs.slice(-10)
    let message = '📜 Последние логи (хронология):\n\n'
    
    lastLogs.forEach((log, i) => {
      const time = log.timestamp ? new Date(log.timestamp).toLocaleTimeString('ru-RU') : '---'
      const ref = log.referrer || 'direct'
      const userAgent = log.userAgent || 'unknown'
      
      message += `${i + 1}. Порезка: <code>${log.path || '/'}</code>\nIP: <code>${log.ip || '0.0.0.0'}</code>\nRef: ${truncate(ref)}\nBrowser: ${truncate(userAgent)}\nВремя: ${time}\n\n`
    })
    
    await ctx.reply(message, { parse_mode: 'HTML' })
  } catch (error) {
    await ctx.reply('❌ Ошибка получения логов')
  }
}

export const visitorsCommand = async (ctx) => {
  try {
    const response = await fetch('http://localhost:3000/api/logs')
    if (!response.ok) throw new Error('API Error')
    
    const logs = await response.json()

    if (!logs || logs.length === 0) {
      await ctx.reply('👥 Пока нет посетителей')
      return
    }

    // Показываем сначала САМЫЕ СВЕЖИЕ (reverse)
    const latestVisitors = [...logs].reverse().slice(0, 10)
    let message = '👥 Свежие посетители (сначала новые):\n\n'
    
    latestVisitors.forEach((log, i) => {
      const time = log.timestamp ? new Date(log.timestamp).toLocaleString('ru-RU') : '---'
      const ref = log.referrer || 'direct'
      const ua = log.userAgent || 'unknown'
      
      message += `${i + 1}. Путь: <code>${log.path || '/'}</code>\nIP: <code>${log.ip || '0.0.0.0'}</code>\nRef: ${truncate(ref)}\nBrowser: ${truncate(ua)}\nВремя: ${time}\n\n`
    })

    await ctx.reply(message, { parse_mode: 'HTML' })
  } catch (error) {
    await ctx.reply('❌ Ошибка получения посетителей')
  }
}

export const helpCommand = async (ctx) => {
  const message = `
❓ Справка:
/start - главное меню
/stats - статистика
/logs - хронология логов
/visitors - последние посетители
/help - эта справка
  `.trim()
  await ctx.reply(message)
}