import { query } from '../../lib/db'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { whatsapp, shop_domain } = req.body || {}
  if (!whatsapp || !shop_domain) {
    return res.status(400).json({ error: 'whatsapp and shop_domain are required' })
  }

  const normalized = whatsapp.replace(/[^\d+]/g, '')

  // Generate a 6-digit code
  const code = String(Math.floor(100000 + Math.random() * 900000))

  // Upsert — same shop+whatsapp gets a fresh code each time
  await query(
    `INSERT INTO whatsapp_registrations (whatsapp, shop_domain, code, created_at)
     VALUES (?, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE code = VALUES(code), created_at = NOW()`,
    [normalized, shop_domain, code]
  )

  return res.json({ success: true, code })
}
