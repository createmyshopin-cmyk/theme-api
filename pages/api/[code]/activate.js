import { query } from '../../../lib/db'

async function fetchStoreName(shopDomain) {
  try {
    const r = await fetch(`https://${shopDomain}/meta.json`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000),
    })
    if (!r.ok) return null
    const data = await r.json()
    return data?.name || null
  } catch { return null }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const license_code = req.query.code
  const { phone, shop_domain, theme_name } = req.body || {}

  if (!phone || !license_code || !shop_domain) {
    return res.status(400).json({ error: 'phone, license_code and shop_domain are required' })
  }

  const digitsOnly = phone.replace(/\D/g, '')

  const rows = await query(
    'SELECT * FROM licenses WHERE REPLACE(REPLACE(phone, "+", ""), " ", "") LIKE ? AND license_code = ?',
    ['%' + digitsOnly, license_code]
  )

  if (rows.length === 0) {
    return res.status(404).json({ valid: false, error: 'Invalid phone or license code' })
  }

  const license = rows[0]

  if (license.is_active && license.shop_domain && license.shop_domain !== shop_domain) {
    return res.status(409).json({
      valid: false,
      error: 'This license is already activated on another store',
    })
  }

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null
  const storeName = await fetchStoreName(shop_domain)

  await query(
    'UPDATE licenses SET is_active = 1, shop_domain = ?, store_name = ?, activated_at = NOW(), theme_name = ? WHERE id = ?',
    [shop_domain, storeName, theme_name || license.theme_name, license.id]
  )

  // Also mark whatsapp_registrations as activated
  await query(
    `UPDATE whatsapp_registrations SET activated = 1, activated_at = NOW()
     WHERE code = ? OR REPLACE(REPLACE(whatsapp,'+',''),' ','') LIKE ?`,
    [license_code, '%' + digitsOnly]
  ).catch(() => {})

  await query(
    "INSERT INTO activation_log (license_id, shop_domain, ip_address, action) VALUES (?, ?, ?, 'activate')",
    [license.id, shop_domain, ip]
  )

  return res.json({ valid: true, message: 'License activated successfully' })
}
