import { query } from '../../lib/db'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const rows = await query(
    'SELECT title, message, update_url FROM theme_updates WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1',
    []
  )
  return res.json(rows[0] || null)
}
