import crypto from 'crypto'

export function generateLicenseCode() {
  // Cryptographically random 6-digit code: 100000 – 999999
  const buf = crypto.randomBytes(4)
  const num = buf.readUInt32BE(0)
  return String(100000 + (num % 900000))
}
