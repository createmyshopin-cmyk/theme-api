import { requireAdmin } from '../../../lib/auth'
import { query } from '../../../lib/db'
import { generateLicenseCode } from '../../../lib/generate'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!requireAdmin(req, res)) return

  const { phone, notes, validity } = req.body || {}
  if (!phone) return res.status(400).json({ error: 'phone is required' })
  const validityValue = validity === 'unlimited' ? 'unlimited' : '1year'

  // Normalize phone: strip non-digit chars except leading +
  const normalized = phone.replace(/[^\d+]/g, '')

  // Check if phone already has a license
  const existing = await query('SELECT * FROM licenses WHERE phone = ?', [normalized])
  if (existing.length > 0) {
    return res.status(409).json({
      error: 'License already exists for this phone number',
      license: existing[0],
    })
  }

  // Generate unique 6-digit code
  let code, tries = 0
  do {
    code = generateLicenseCode()
    const conflict = await query('SELECT id FROM licenses WHERE license_code = ?', [code])
    if (conflict.length === 0) break
    tries++
  } while (tries < 20)

  await query(
    'INSERT INTO licenses (phone, license_code, notes, validity) VALUES (?, ?, ?, ?)',
    [normalized, code, notes || null, validityValue]
  )

  return res.status(201).json({ phone: normalized, license_code: code, validity: validityValue })
}
