import { requireAdmin } from '../../../lib/auth'
import { query } from '../../../lib/db'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    const rows = await query(
      'SELECT id, phone, license_code, shop_domain, is_active, activated_at, created_at, notes, theme_name FROM licenses ORDER BY created_at DESC',
      []
    )
    return res.json(rows)
  }

  if (req.method === 'DELETE') {
    const { id, pin } = req.query
    if (!id) return res.status(400).json({ error: 'id required' })
    if (!pin || pin !== process.env.ADMIN_PIN) {
      return res.status(403).json({ error: 'Invalid PIN' })
    }
    await query('DELETE FROM licenses WHERE id = ?', [id])
    return res.json({ success: true })
  }

  return res.status(405).end()
}
