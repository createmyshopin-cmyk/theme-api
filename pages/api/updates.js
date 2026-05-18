import { query } from '../../lib/db'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const rows = await query(
    'SELECT title, message, update_url, is_active, created_at FROM theme_updates ORDER BY created_at DESC LIMIT 20',
    []
  )
  if (rows.length === 0) return res.json(null)
  // latest active is the "current" update; full list is the changelog
  const active = rows.find(r => r.is_active) || null
  return res.json({ current: active, changelog: rows })
}
