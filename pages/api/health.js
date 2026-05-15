import { query } from '../../lib/db'

export default async function handler(req, res) {
  try {
    await query('SELECT 1', [])
    res.json({ status: 'ok', db: 'connected' })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}
