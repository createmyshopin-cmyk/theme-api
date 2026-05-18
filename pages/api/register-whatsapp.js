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

  // Check if this phone already has a license
  const existing = await query(
    'SELECT license_code, is_active FROM licenses WHERE REPLACE(REPLACE(phone, "+", ""), " ", "") LIKE ?',
    ['%' + normalized.replace(/^\+/, '')]
  )

  let code
  if (existing.length > 0) {
    // Reuse existing license code
    code = existing[0].license_code
  } else {
    // Generate unique 6-digit code not already in licenses
    let unique = false
    while (!unique) {
      code = String(Math.floor(100000 + Math.random() * 900000))
      const clash = await query('SELECT id FROM licenses WHERE license_code = ?', [code])
      if (clash.length === 0) unique = true
    }
    // Auto-create license record
    await query(
      `INSERT INTO licenses (phone, license_code, is_active, created_at)
       VALUES (?, ?, 0, NOW())`,
      [normalized, code]
    )
  }

  // Upsert registration record
  await query(
    `INSERT INTO whatsapp_registrations (whatsapp, shop_domain, code, created_at)
     VALUES (?, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE code = VALUES(code), created_at = NOW()`,
    [normalized, shop_domain, code]
  )

  return res.json({ success: true, code })
}
