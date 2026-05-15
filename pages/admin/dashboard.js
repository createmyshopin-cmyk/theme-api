import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Dashboard() {
  const router = useRouter()
  const [token, setToken] = useState(null)
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [genPhone, setGenPhone] = useState('')
  const [genNotes, setGenNotes] = useState('')
  const [genResult, setGenResult] = useState(null)
  const [genError, setGenError] = useState('')
  const [genLoading, setGenLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const t = localStorage.getItem('triara_admin_token')
    if (!t) { router.replace('/admin'); return }
    setToken(t)
  }, [])

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token])

  const fetchLicenses = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/licenses', { headers: authHeaders() })
      if (res.status === 401) { handleLogout(); return }
      const data = await res.json()
      setLicenses(Array.isArray(data) ? data : [])
    } catch {
      showToast('Failed to load licenses', 'error')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchLicenses() }, [fetchLicenses])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  function handleLogout() {
    localStorage.removeItem('triara_admin_token')
    router.replace('/admin')
  }

  async function handleGenerate(e) {
    e.preventDefault()
    setGenError('')
    setGenResult(null)
    setGenLoading(true)
    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ phone: genPhone, notes: genNotes }),
      })
      const data = await res.json()
      if (!res.ok) {
        setGenError(data.error || 'Failed to generate')
        if (data.license) setGenResult({ existing: true, ...data.license })
      } else {
        setGenResult(data)
        setGenPhone('')
        setGenNotes('')
        fetchLicenses()
        showToast(`License ${data.license_code} created`)
      }
    } catch {
      setGenError('Network error')
    } finally {
      setGenLoading(false)
    }
  }

  async function handleRevoke(id, phone) {
    if (!confirm(`Revoke license for ${phone}? This will deactivate their store.`)) return
    try {
      const res = await fetch('/api/admin/revoke', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      showToast('License revoked')
      fetchLicenses()
    } catch {
      showToast('Failed to revoke', 'error')
    }
  }

  async function handleDelete(id, phone) {
    if (!confirm(`Permanently delete license for ${phone}?`)) return
    try {
      const res = await fetch(`/api/admin/licenses?id=${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      if (!res.ok) throw new Error()
      showToast('License deleted')
      fetchLicenses()
    } catch {
      showToast('Failed to delete', 'error')
    }
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code)
    showToast(`Copied ${code}`)
  }

  const filtered = licenses.filter(l =>
    l.phone?.includes(search) ||
    l.license_code?.includes(search) ||
    l.shop_domain?.includes(search) ||
    l.notes?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: licenses.length,
    active: licenses.filter(l => l.is_active).length,
    inactive: licenses.filter(l => !l.is_active).length,
  }

  return (
    <>
      <Head>
        <title>Triara Admin — Dashboard</title>
      </Head>
      <div style={s.page}>
        {/* Header */}
        <header style={s.header}>
          <div style={s.headerInner}>
            <span style={s.headerLogo}>🔐 Triara License Admin</span>
            <button style={s.logoutBtn} onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <main style={s.main}>
          {/* Stats */}
          <div style={s.statsRow}>
            {[
              { label: 'Total Licenses', value: stats.total, color: '#6366f1' },
              { label: 'Active', value: stats.active, color: '#22c55e' },
              { label: 'Inactive', value: stats.inactive, color: '#f59e0b' },
            ].map(st => (
              <div key={st.label} style={{ ...s.statCard, borderTop: `4px solid ${st.color}` }}>
                <div style={{ ...s.statValue, color: st.color }}>{st.value}</div>
                <div style={s.statLabel}>{st.label}</div>
              </div>
            ))}
          </div>

          <div style={s.cols}>
            {/* Generate form */}
            <div style={s.panel}>
              <h2 style={s.panelTitle}>Generate New License</h2>
              <form onSubmit={handleGenerate}>
                <div style={s.field}>
                  <label style={s.label}>Phone Number *</label>
                  <input
                    style={s.input}
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={genPhone}
                    onChange={e => setGenPhone(e.target.value)}
                    required
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Notes (optional)</label>
                  <input
                    style={s.input}
                    type="text"
                    placeholder="Customer name, order ID…"
                    value={genNotes}
                    onChange={e => setGenNotes(e.target.value)}
                  />
                </div>
                {genError && <p style={s.err}>{genError}</p>}
                {genResult && (
                  <div style={{ ...s.resultBox, background: genResult.existing ? '#fef3c7' : '#f0fdf4', border: `1px solid ${genResult.existing ? '#fde68a' : '#bbf7d0'}` }}>
                    <div style={s.resultLabel}>{genResult.existing ? 'Existing license:' : 'License created:'}</div>
                    <div style={s.resultCode} onClick={() => copyCode(genResult.license_code)}>
                      {genResult.license_code}
                      <span style={s.copyHint}>click to copy</span>
                    </div>
                    <div style={s.resultPhone}>{genResult.phone}</div>
                  </div>
                )}
                <button style={{ ...s.primaryBtn, opacity: genLoading ? 0.7 : 1 }} type="submit" disabled={genLoading}>
                  {genLoading ? 'Generating…' : '+ Generate License'}
                </button>
              </form>
            </div>

            {/* Licenses table */}
            <div style={{ ...s.panel, flex: 2 }}>
              <div style={s.tableHeader}>
                <h2 style={{ ...s.panelTitle, margin: 0 }}>All Licenses</h2>
                <input
                  style={{ ...s.input, width: 220, margin: 0 }}
                  placeholder="Search phone, code, domain…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {loading ? (
                <p style={s.loadingText}>Loading…</p>
              ) : filtered.length === 0 ? (
                <p style={s.emptyText}>{search ? 'No results found.' : 'No licenses yet.'}</p>
              ) : (
                <div style={s.tableWrap}>
                  <table style={s.table}>
                    <thead>
                      <tr>
                        {['Phone', 'Code', 'Shop Domain', 'Status', 'Activated', 'Notes', 'Actions'].map(h => (
                          <th key={h} style={s.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(lic => (
                        <tr key={lic.id} style={s.tr}>
                          <td style={s.td}>{lic.phone}</td>
                          <td style={s.td}>
                            <span
                              style={s.codeChip}
                              onClick={() => copyCode(lic.license_code)}
                              title="Click to copy"
                            >
                              {lic.license_code}
                            </span>
                          </td>
                          <td style={{ ...s.td, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {lic.shop_domain || <span style={s.muted}>—</span>}
                          </td>
                          <td style={s.td}>
                            <span style={{ ...s.badge, ...(lic.is_active ? s.badgeActive : s.badgeInactive) }}>
                              {lic.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={s.td}>
                            {lic.activated_at
                              ? new Date(lic.activated_at).toLocaleDateString('en-IN')
                              : <span style={s.muted}>—</span>}
                          </td>
                          <td style={{ ...s.td, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {lic.notes || <span style={s.muted}>—</span>}
                          </td>
                          <td style={s.td}>
                            <div style={s.actions}>
                              {lic.is_active && (
                                <button style={s.revokeBtn} onClick={() => handleRevoke(lic.id, lic.phone)}>
                                  Revoke
                                </button>
                              )}
                              <button style={s.deleteBtn} onClick={() => handleDelete(lic.id, lic.phone)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Toast */}
        {toast && (
          <div style={{ ...s.toast, background: toast.type === 'error' ? '#ef4444' : '#22c55e' }}>
            {toast.msg}
          </div>
        )}
      </div>
    </>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: '#0f172a',
  },
  header: {
    background: '#0f172a',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  headerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLogo: { color: '#fff', fontWeight: 700, fontSize: 18 },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #475569',
    color: '#94a3b8',
    padding: '6px 14px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
  },
  main: { maxWidth: 1200, margin: '0 auto', padding: '28px 24px' },
  statsRow: { display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' },
  statCard: {
    flex: '1 1 140px',
    background: '#fff',
    borderRadius: 12,
    padding: '20px 24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
  },
  statValue: { fontSize: 32, fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: 13, color: '#64748b', marginTop: 6 },
  cols: { display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' },
  panel: {
    flex: 1,
    background: '#fff',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    minWidth: 280,
  },
  panelTitle: { fontSize: 17, fontWeight: 700, margin: '0 0 20px' },
  field: { marginBottom: 16 },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#475569',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 7,
    fontSize: 14,
    boxSizing: 'border-box',
    outline: 'none',
  },
  err: {
    color: '#ef4444',
    fontSize: 13,
    background: '#fef2f2',
    padding: '8px 12px',
    borderRadius: 6,
    border: '1px solid #fecaca',
    margin: '0 0 12px',
  },
  resultBox: {
    borderRadius: 8,
    padding: '12px 16px',
    marginBottom: 14,
  },
  resultLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 },
  resultCode: {
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: '0.1em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  copyHint: { fontSize: 11, color: '#94a3b8', fontWeight: 400 },
  resultPhone: { fontSize: 13, color: '#64748b', marginTop: 2 },
  primaryBtn: {
    width: '100%',
    padding: '11px',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
    flexWrap: 'wrap',
  },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: {
    padding: '10px 12px',
    textAlign: 'left',
    background: '#f8fafc',
    borderBottom: '2px solid #e2e8f0',
    fontWeight: 600,
    color: '#475569',
    whiteSpace: 'nowrap',
  },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '10px 12px', verticalAlign: 'middle' },
  codeChip: {
    background: '#ede9fe',
    color: '#4f46e5',
    padding: '3px 10px',
    borderRadius: 20,
    fontWeight: 700,
    letterSpacing: '0.08em',
    cursor: 'pointer',
    fontSize: 13,
    display: 'inline-block',
  },
  badge: {
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  badgeActive: { background: '#dcfce7', color: '#15803d' },
  badgeInactive: { background: '#fef3c7', color: '#92400e' },
  muted: { color: '#94a3b8' },
  actions: { display: 'flex', gap: 6 },
  revokeBtn: {
    padding: '4px 10px',
    background: '#fff7ed',
    border: '1px solid #fed7aa',
    color: '#c2410c',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
  },
  deleteBtn: {
    padding: '4px 10px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
  },
  loadingText: { color: '#94a3b8', textAlign: 'center', padding: '40px 0' },
  emptyText: { color: '#94a3b8', textAlign: 'center', padding: '40px 0', fontSize: 14 },
  toast: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    color: '#fff',
    padding: '12px 20px',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    zIndex: 9999,
    animation: 'fadeIn 0.2s ease',
  },
}
