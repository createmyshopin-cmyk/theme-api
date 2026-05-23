import { query } from '../../../lib/db'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).end()

  const license_code = req.query.code
  const shop_domain = req.method === 'GET' ? req.query.shop_domain : (req.body || {}).shop_domain

  if (!shop_domain || !license_code) {
    return res.status(400).json({ valid: false, error: 'shop_domain and license_code are required' })
  }

  const rows = await query(
    'SELECT id, is_active, shop_domain, expires_at FROM licenses WHERE license_code = ?',
    [license_code]
  )

  if (rows.length === 0) return res.json({ valid: false, error: 'License not found' })

  const license = rows[0]
  const expired = license.expires_at ? new Date(license.expires_at) < new Date() : false

  // Strict store-lock: license must be active, bound to this exact store, and not expired
  const storeMismatch = !license.shop_domain || license.shop_domain !== shop_domain
  const valid = license.is_active === 1 && !storeMismatch && !expired

  if (valid) {
    // Update last_seen silently
    query('UPDATE licenses SET last_seen = NOW() WHERE id = ?', [license.id]).catch(() => {})
  }

  if (!valid) {
    if (expired)         return res.json({ valid: false, expired: true })
    if (storeMismatch)   return res.json({ valid: false, error: 'License is not activated for this store' })
    if (!license.is_active) return res.json({ valid: false, error: 'License is not active' })
  }

  return res.json({ valid: true, expired: false })
}
