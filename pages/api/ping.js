import { query } from '../../lib/db'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { shop_domain, theme_name, license_code } = req.body || {}
  if (!shop_domain || !license_code) return res.status(400).json({ ok: false })

  await query(
    `UPDATE licenses
     SET theme_name = ?, last_seen = NOW()
     WHERE license_code = ? AND shop_domain = ? AND is_active = 1`,
    [theme_name || null, license_code, shop_domain]
  ).catch(() => {})

  return res.json({ ok: true })
}
