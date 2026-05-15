import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'fallback_secret'

export function signAdminToken() {
  return jwt.sign({ role: 'admin' }, SECRET, { expiresIn: '8h' })
}

export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

export function requireAdmin(req, res) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token || !verifyAdminToken(token)) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  return true
}
