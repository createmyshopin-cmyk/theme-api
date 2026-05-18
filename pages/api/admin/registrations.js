import { requireAdmin } from '../../../lib/auth'
import { query } from '../../../lib/db'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    const rows = await query(
      'SELECT id, whatsapp, shop_domain, code, created_at FROM whatsapp_registrations ORDER BY created_at DESC',
      []
    )
    return res.json(rows)
  }

  return res.status(405).end()
}
