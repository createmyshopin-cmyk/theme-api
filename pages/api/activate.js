import { query } from '../../lib/db'

async function fetchStoreName(shopDomain) {
  try {
    const r = await fetch(`https://${shopDomain}/meta.json`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000),
    })
    if (!r.ok) return null
    const data = await r.json()
    return data?.name || null
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { phone, license_code, shop_domain } = req.body || {}

  if (!phone || !license_code || !shop_domain) {
    return res.status(400).json({ error: 'phone, license_code and shop_domain are required' })
  }

  const normalized = phone.replace(/[^\d+]/g, '')
  // Strip leading + and country codes so +919947653215 matches 9947653215
  const digitsOnly = normalized.replace(/^\+/, '')

  const rows = await query(
    `SELECT * FROM licenses WHERE license_code = ?
     AND (phone = ? OR phone = ? OR REPLACE(REPLACE(phone,'+',''),' ','') = ?)`,
    [license_code, normalized, digitsOnly, digitsOnly]
  )

  if (rows.length === 0) {
    return res.status(404).json({ valid: false, error: 'Invalid phone or license code' })
  }

  const license = rows[0]

  // Already active on a DIFFERENT shop → reject
  if (license.is_active && license.shop_domain && license.shop_domain !== shop_domain) {
    return res.status(409).json({
      valid: false,
      error: 'This license is already activated on another store',
    })
  }

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null

  // Fetch store name from Shopify public meta endpoint
  const storeName = await fetchStoreName(shop_domain)

  await query(
    `UPDATE licenses SET is_active = 1, shop_domain = ?, store_name = ?, activated_at = NOW() WHERE id = ?`,
    [shop_domain, storeName, license.id]
  )

  await query(
    `INSERT INTO activation_log (license_id, shop_domain, ip_address, action) VALUES (?, ?, ?, 'activate')`,
    [license.id, shop_domain, ip]
  )

  return res.json({ valid: true, message: 'License activated successfully' })
}
