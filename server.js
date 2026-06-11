import express from 'express'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import { Telegraf } from 'telegraf'
import { startCommand, statsCommand, logsCommand, visitorsCommand, helpCommand } from './commands.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())

const port = process.env.PORT || 3000
const botToken = process.env.TELEGRAM_BOT_TOKEN
const chatId = process.env.TELEGRAM_CHAT_ID

console.log('[CONFIG] Bot Token:', botToken ? '✅ SET' : '❌ NOT SET')
console.log('[CONFIG] Chat ID:', chatId ? `✅ ${chatId}` : '❌ NOT SET')
console.log('[CONFIG] PORT:', port)

// Serve static files and index.html for the frontend
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// Storage для логов
const visitLogs = {
  visits: [],
  totalVisits: 0,
  uniqueIPs: new Set(),
  uptime: process.uptime(),
}

let bot = null

// Initialize Telegram Bot with validation and error handling
async function initBot() {
  if (!botToken) {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN not set in .env')
    return
  }

  bot = new Telegraf(botToken)

  bot.command('start', startCommand)
  bot.command('stats', statsCommand)
  bot.command('logs', logsCommand)
  bot.command('visitors', visitorsCommand)
  bot.command('help', helpCommand)

  try {
    await bot.launch()
    console.log('✅ Telegram bot started')
  } catch (error) {
    console.error('❌ Failed to start Telegram bot:', error?.response?.description || error?.message)
    if (error?.response?.error_code === 401) {
      console.error('🔒 Unauthorized (401): the provided TELEGRAM_BOT_TOKEN is invalid. Please check your .env and the token from @BotFather.')
    }
    bot = null
  }
}

initBot()

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Обработка preflight запросов
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
    return
  }
  
  next()
})

// Логирование визитов
app.post('/visit', async (req, res) => {
  console.log('[VISIT] Получен запрос:', req.body)
  
  const { path, userAgent, timestamp, referrer } = req.body
  const ipHeader = req.headers['x-forwarded-for'] || req.headers['x-real-ip']
  const ip = ipHeader ? String(ipHeader).split(',')[0].trim() : req.socket.remoteAddress || 'unknown'
  const ref = referrer || 'direct'

  visitLogs.visits.push({ path, ip, userAgent, timestamp, referrer: ref })
  visitLogs.totalVisits++
  visitLogs.uniqueIPs.add(ip)

  console.log(`[VISIT] Новый визит: ${path} | IP: ${ip} | referrer: ${ref}`)

  // Отправить в Telegram
  if (bot && chatId) {
    const time = new Date(timestamp).toLocaleString('ru-RU')
    const message = `
📌 Новый визит
🔗 Страница: ${path}
🌐 IP: ${ip}
🔁 Referrer: ${ref}
💻 Браузер: ${userAgent}
⏰ ${time}
📊 Всего: ${visitLogs.totalVisits}
    `.trim()

    try {
      console.log('[BOT] Отправляем сообщение в Telegram...')
      await bot.telegram.sendMessage(chatId, message)
      console.log('[BOT] ✅ Сообщение отправлено!')
    } catch (error) {
      console.error('[BOT] ❌ Ошибка отправки:', error.message)
    }
  } else {
    console.warn('[BOT] ⚠️ Бот не инициализирован или chatId не установлен')
  }

  res.json({ success: true })
})

// API для статистики
app.get('/api/stats', (req, res) => {
  res.json({
    totalVisits: visitLogs.totalVisits,
    uniqueIPs: Array.from(visitLogs.uniqueIPs),
    uniqueIPCount: visitLogs.uniqueIPs.size,
    uptime: process.uptime(),
  })
})

// API для логов
app.get('/api/logs', (req, res) => {
  res.json(visitLogs.visits)
})

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    botRunning: !!bot,
    totalVisits: visitLogs.totalVisits,
  })
})

app.listen(port, () => {
  console.log(`
╔════════════════════════════════╗
║  🚀 Server running             ║
║  📍 http://localhost:${port}       ║
║  💚 /health - статус           ║
║  📊 /api/stats - статистика    ║
╚════════════════════════════════╝
  `)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Server closing...')
  if (bot) bot.stop()
  process.exit(0)
})
