import { query } from '../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { phone, license_code, shop_domain } = req.body || {}

  if (!phone || !license_code || !shop_domain) {
    return res.status(400).json({ error: 'phone, license_code and shop_domain are required' })
  }

  const normalized = phone.replace(/[^\d+]/g, '')

  const rows = await query(
    'SELECT * FROM licenses WHERE phone = ? AND license_code = ?',
    [normalized, license_code]
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

  await query(
    `UPDATE licenses SET is_active = 1, shop_domain = ?, activated_at = NOW() WHERE id = ?`,
    [shop_domain, license.id]
  )

  await query(
    `INSERT INTO activation_log (license_id, shop_domain, ip_address, action) VALUES (?, ?, ?, 'activate')`,
    [license.id, shop_domain, ip]
  )

  return res.json({ valid: true, message: 'License activated successfully' })
}
