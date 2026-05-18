import { requireAdmin } from '../../../lib/auth'
import { query } from '../../../lib/db'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    const rows = await query(
      'SELECT id, title, message, update_url, is_active, created_at FROM theme_updates ORDER BY created_at DESC',
      []
    )
    return res.json(rows)
  }

  if (req.method === 'POST') {
    const { title, message, update_url } = req.body || {}
    if (!title || !message) return res.status(400).json({ error: 'title and message required' })
    await query('UPDATE theme_updates SET is_active = 0', [])
    await query(
      'INSERT INTO theme_updates (title, message, update_url, is_active, created_at) VALUES (?, ?, ?, 1, NOW())',
      [title, message, update_url || null]
    )
    return res.json({ success: true })
  }

  if (req.method === 'DELETE') {
    await query('UPDATE theme_updates SET is_active = 0', [])
    return res.json({ success: true })
  }

  return res.status(405).end()
}
