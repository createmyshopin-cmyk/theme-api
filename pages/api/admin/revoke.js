import { requireAdmin } from '../../../lib/auth'
import { query } from '../../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!requireAdmin(req, res)) return

  const { id } = req.body || {}
  if (!id) return res.status(400).json({ error: 'id required' })

  await query(
    'UPDATE licenses SET is_active = 0, shop_domain = NULL, activated_at = NULL WHERE id = ?',
    [id]
  )
  return res.json({ success: true })
}
