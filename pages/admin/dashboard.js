import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

const NAV = [
  { id: 'licenses', label: 'All Licenses', icon: '🔑' },
  { id: 'pending',  label: 'Pending',       icon: '⏳' },
  { id: 'generate', label: 'Generate',      icon: '✨' },
]

export default function Dashboard() {
  const router = useRouter()
  const [token, setToken]           = useState(null)
  const [licenses, setLicenses]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [genPhone, setGenPhone]     = useState('')
  const [genNotes, setGenNotes]     = useState('')
  const [genResult, setGenResult]   = useState(null)
  const [genError, setGenError]     = useState('')
  const [genLoading, setGenLoading] = useState(false)
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [toast, setToast]           = useState(null)
  const [activeNav, setActiveNav]   = useState('licenses')
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    setGenError(''); setGenResult(null); setGenLoading(true)
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
        setGenPhone(''); setGenNotes('')
        fetchLicenses()
        showToast(`License ${data.license_code} created`)
      }
    } catch { setGenError('Network error') }
    finally { setGenLoading(false) }
  }

  async function handleRevoke(id, phone) {
    if (!confirm(`Revoke license for ${phone}?`)) return
    try {
      const res = await fetch('/api/admin/revoke', {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      showToast('License revoked'); fetchLicenses()
    } catch { showToast('Failed to revoke', 'error') }
  }

  async function handleDelete(id, phone) {
    if (!confirm(`Permanently delete license for ${phone}?`)) return
    try {
      const res = await fetch(`/api/admin/licenses?id=${id}`, {
        method: 'DELETE', headers: authHeaders(),
      })
      if (!res.ok) throw new Error()
      showToast('License deleted'); fetchLicenses()
    } catch { showToast('Failed to delete', 'error') }
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code)
    showToast(`Copied ${code}`)
  }

  const now = new Date()
  const stats = {
    total:     licenses.length,
    active:    licenses.filter(l => l.is_active).length,
    inactive:  licenses.filter(l => !l.is_active).length,
    thisMonth: licenses.filter(l => {
      if (!l.activated_at) return false
      const d = new Date(l.activated_at)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length,
    thisYear: licenses.filter(l => {
      if (!l.activated_at) return false
      return new Date(l.activated_at).getFullYear() === now.getFullYear()
    }).length,
  }

  const monthName = now.toLocaleString('en', { month: 'long' })

  // Source list depending on active nav
  const sourceList = activeNav === 'pending'
    ? licenses.filter(l => !l.is_active)
    : licenses

  // Apply search + status filter
  const filtered = sourceList.filter(l => {
    const matchSearch =
      !search ||
      l.phone?.includes(search) ||
      l.license_code?.includes(search) ||
      l.shop_domain?.includes(search) ||
      l.notes?.toLowerCase().includes(search.toLowerCase())
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && l.is_active) ||
      (statusFilter === 'inactive' && !l.is_active)
    return matchSearch && matchStatus
  })

  function navTo(id) {
    setActiveNav(id)
    setSearch('')
    setStatusFilter('all')
    setSidebarOpen(false)
  }

  const isTable = activeNav === 'licenses' || activeNav === 'pending'

  return (
    <>
      <Head><title>ThemePro — Dashboard</title></Head>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={s.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <div style={s.layout}>

        {/* Sidebar */}
        <aside id="cms-sidebar" style={{ ...s.sidebar, ...(sidebarOpen ? s.sidebarOpen : {}) }}>
          <div style={s.sidebarTop}>
            <div style={s.sidebarLogo}>
              <div style={s.sidebarLogoIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div style={s.sidebarBrand}>ThemePro</div>
                <div style={s.sidebarSub}>License Panel</div>
              </div>
            </div>

            <nav style={s.nav}>
              <div style={s.navSection}>MENU</div>
              {NAV.map(item => (
                <button
                  key={item.id}
                  style={{ ...s.navItem, ...(activeNav === item.id ? s.navItemActive : {}) }}
                  onClick={() => navTo(item.id)}
                >
                  <span style={s.navIcon}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.id === 'pending' && stats.inactive > 0 && (
                    <span style={s.navBadge}>{stats.inactive}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div style={s.sidebarBottom}>
            <div style={s.sidebarDivider} />
            <div style={s.sidebarUser}>
              <div style={s.sidebarAvatar}>A</div>
              <div>
                <div style={s.sidebarUserName}>Admin</div>
                <div style={s.sidebarUserRole}>createmyshop.in</div>
              </div>
            </div>
            <button style={s.logoutBtn} onClick={handleLogout}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{marginRight:6}}>
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <div id="cms-main" style={s.main}>

          {/* Top bar */}
          <header style={s.topbar}>
            <div style={s.topbarLeft}>
              <button id="cms-hamburger" style={s.hamburger} onClick={() => setSidebarOpen(v => !v)}>
                <span style={s.ham} /><span style={s.ham} /><span style={s.ham} />
              </button>
              <div>
                <h1 style={s.pageTitle}>
                  {activeNav === 'licenses' ? 'All Licenses'
                   : activeNav === 'pending' ? 'Pending Licenses'
                   : 'Generate License'}
                </h1>
                <p style={s.pageSub}>
                  {activeNav === 'licenses' && `${stats.total} total · ${stats.active} active`}
                  {activeNav === 'pending' && `${stats.inactive} not yet activated`}
                  {activeNav === 'generate' && 'Create a new license key'}
                </p>
              </div>
            </div>

            {isTable && (
              <div style={s.topbarRight}>
                <input
                  style={s.searchInput}
                  placeholder="Search…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {activeNav === 'licenses' && (
                  <select
                    style={s.filterSelect}
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                )}
              </div>
            )}
          </header>

          <div style={s.content}>

            {/* Stats */}
            <div id="cms-stats-row" style={s.statsRow}>
              {[
                { label: 'Total',    value: stats.total,     color: '#6366f1', bg: '#eef2ff',  icon: '📋' },
                { label: 'Active',   value: stats.active,    color: '#16a34a', bg: '#dcfce7',  icon: '✅' },
                { label: 'Pending',  value: stats.inactive,  color: '#d97706', bg: '#fef3c7',  icon: '⏳' },
                { label: monthName,  value: stats.thisMonth, color: '#0284c7', bg: '#e0f2fe',  icon: '📅' },
                { label: `${now.getFullYear()}`, value: stats.thisYear, color: '#7c3aed', bg: '#ede9fe', icon: '📆' },
              ].map(st => (
                <div key={st.label} style={s.statCard}>
                  <div style={{ ...s.statIconWrap, background: st.bg, color: st.color }}>{st.icon}</div>
                  <div style={{ ...s.statValue, color: st.color }}>{st.value}</div>
                  <div style={s.statLabel}>{st.label}</div>
                </div>
              ))}
            </div>

            {/* Generate */}
            {activeNav === 'generate' && (
              <div style={s.generateWrap}>
                <div style={s.generateCard}>
                  <h2 style={s.cardTitle}>New License</h2>
                  <form onSubmit={handleGenerate}>
                    <div style={s.field}>
                      <label style={s.label}>Phone Number *</label>
                      <input style={s.input} type="tel" placeholder="+91 98765 43210"
                        value={genPhone} onChange={e => setGenPhone(e.target.value)} required />
                    </div>
                    <div style={s.field}>
                      <label style={s.label}>Theme Name / Notes</label>
                      <input style={s.input} type="text" placeholder="e.g. Triara Express — Order #1234"
                        value={genNotes} onChange={e => setGenNotes(e.target.value)} />
                    </div>
                    {genError && <p style={s.err}>{genError}</p>}
                    {genResult && (
                      <div style={{ ...s.resultBox, background: genResult.existing ? '#fef3c7' : '#f0fdf4', border: `1.5px solid ${genResult.existing ? '#fde68a' : '#bbf7d0'}` }}>
                        <div style={s.resultLabel}>{genResult.existing ? 'Existing license:' : '✅ License created:'}</div>
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
              </div>
            )}

            {/* Table (All / Pending) */}
            {isTable && (
              <div style={s.tableCard}>
                {loading ? (
                  <div style={s.centerMsg}>
                    <div style={s.spinner} />
                    <p style={s.mutedText}>Loading…</p>
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={s.centerMsg}>
                    <div style={{fontSize:40, marginBottom:12}}>
                      {activeNav === 'pending' ? '🎉' : '🔑'}
                    </div>
                    <p style={s.mutedText}>
                      {activeNav === 'pending'
                        ? 'No pending licenses — all activated!'
                        : search ? 'No results found.' : 'No licenses yet.'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Mobile cards */}
                    <div id="cms-mobile-cards" style={s.mobileCards}>
                      {filtered.map(lic => (
                        <div key={lic.id} style={s.mobileCard}>
                          <div style={s.mobileCardRow}>
                            <span style={s.mobilePhone}>{lic.phone}</span>
                            <span style={{ ...s.badge, ...(lic.is_active ? s.badgeActive : s.badgeInactive) }}>
                              {lic.is_active ? '● Active' : '○ Pending'}
                            </span>
                          </div>
                          <div style={s.mobileCardRow}>
                            <span style={s.codeChip} onClick={() => copyCode(lic.license_code)}>{lic.license_code}</span>
                            {lic.notes && <span style={s.mobileNotes}>{lic.notes}</span>}
                          </div>
                          {lic.shop_domain && (
                            <div style={s.mobileDomain}>
                              <a href={`https://${lic.shop_domain}`} target="_blank" rel="noopener" style={s.domainLink}>
                                {lic.shop_domain}
                              </a>
                            </div>
                          )}
                          <div style={s.mobileCardRow}>
                            <span style={s.mobileDate}>
                              Created: {lic.created_at ? new Date(lic.created_at).toLocaleDateString('en-IN') : '—'}
                            </span>
                            <div style={s.actions}>
                              {lic.is_active && (
                                <button style={s.revokeBtn} onClick={() => handleRevoke(lic.id, lic.phone)}>Revoke</button>
                              )}
                              <button style={s.deleteBtn} onClick={() => handleDelete(lic.id, lic.phone)}>Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop table */}
                    <div id="cms-desktop-table" style={s.tableWrap}>
                      <table style={s.table}>
                        <thead>
                          <tr>
                            {['Phone', 'Code', 'Theme / Notes', 'Shop Domain', 'Status', 'Created', 'Activated', 'Actions'].map(h => (
                              <th key={h} style={s.th}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((lic, idx) => (
                            <tr key={lic.id} style={{ ...s.tr, background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                              <td style={s.td}><span style={s.phone}>{lic.phone}</span></td>
                              <td style={s.td}>
                                <span style={s.codeChip} onClick={() => copyCode(lic.license_code)} title="Click to copy">
                                  {lic.license_code}
                                </span>
                              </td>
                              <td style={{ ...s.td, maxWidth: 160 }}>
                                <span style={s.notesText}>{lic.notes || <span style={s.muted}>—</span>}</span>
                              </td>
                              <td style={{ ...s.td, maxWidth: 180 }}>
                                {lic.shop_domain
                                  ? <a href={`https://${lic.shop_domain}`} target="_blank" rel="noopener" style={s.domainLink}>{lic.shop_domain}</a>
                                  : <span style={s.muted}>—</span>}
                              </td>
                              <td style={s.td}>
                                <span style={{ ...s.badge, ...(lic.is_active ? s.badgeActive : s.badgeInactive) }}>
                                  {lic.is_active ? '● Active' : '○ Pending'}
                                </span>
                              </td>
                              <td style={s.td}>
                                <span style={s.dateText}>
                                  {lic.created_at ? new Date(lic.created_at).toLocaleDateString('en-IN') : <span style={s.muted}>—</span>}
                                </span>
                              </td>
                              <td style={s.td}>
                                <span style={s.dateText}>
                                  {lic.activated_at ? new Date(lic.activated_at).toLocaleDateString('en-IN') : <span style={s.muted}>—</span>}
                                </span>
                              </td>
                              <td style={s.td}>
                                <div style={s.actions}>
                                  {lic.is_active && (
                                    <button style={s.revokeBtn} onClick={() => handleRevoke(lic.id, lic.phone)}>Revoke</button>
                                  )}
                                  <button style={s.deleteBtn} onClick={() => handleDelete(lic.id, lic.phone)}>Delete</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ ...s.toast, background: toast.type === 'error' ? '#ef4444' : '#16a34a' }}>
          {toast.type === 'error' ? '✕ ' : '✓ '}{toast.msg}
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 769px) {
          #cms-sidebar { transform: translateX(0) !important; }
          #cms-main    { margin-left: 240px !important; }
          #cms-hamburger { display: none !important; }
          #cms-mobile-cards { display: none !important; }
          #cms-desktop-table { display: block !important; }
        }
        @media (max-width: 768px) {
          #cms-desktop-table { display: none !important; }
          #cms-mobile-cards  { display: block !important; }
          #cms-stats-row     { grid-template-columns: repeat(3,1fr) !important; }
          #cms-search-input  { width: 140px !important; }
        }
      `}</style>
    </>
  )
}

const s = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    background: '#f1f5f9',
  },
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 90,
  },

  // Sidebar
  sidebar: {
    width: 240,
    background: '#0f172a',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'fixed',
    top: 0, left: 0, bottom: 0,
    zIndex: 100,
    overflowY: 'auto',
    transform: 'translateX(-100%)',
    transition: 'transform 0.25s ease',
  },
  sidebarOpen: { transform: 'translateX(0)' },
  sidebarTop: { padding: '24px 0 16px' },
  sidebarLogo: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '0 20px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    marginBottom: 16,
  },
  sidebarLogoIcon: {
    width: 38, height: 38,
    background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
    borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
  },
  sidebarBrand: { color:'#fff', fontWeight:800, fontSize:16, letterSpacing:'-0.3px' },
  sidebarSub:   { color:'#475569', fontSize:11, marginTop:1 },
  nav: { padding: '0 12px' },
  navSection: {
    color:'#334155', fontSize:10, fontWeight:700,
    letterSpacing:'0.1em', padding:'0 8px 8px', textTransform:'uppercase',
  },
  navItem: {
    display:'flex', alignItems:'center', gap:10,
    width:'100%', padding:'10px 12px', borderRadius:8,
    border:'none', background:'transparent',
    color:'#94a3b8', fontSize:14, fontWeight:500,
    cursor:'pointer', textAlign:'left', marginBottom:2,
    transition:'background 0.15s, color 0.15s',
  },
  navItemActive: { background:'rgba(99,102,241,0.15)', color:'#818cf8' },
  navIcon: { fontSize:16, width:20, textAlign:'center', flexShrink:0 },
  navBadge: {
    marginLeft:'auto',
    background:'#ef4444', color:'#fff',
    fontSize:10, fontWeight:700,
    padding:'1px 7px', borderRadius:20,
  },
  sidebarBottom: { padding:'16px 16px 24px' },
  sidebarDivider: { height:1, background:'rgba(255,255,255,0.07)', marginBottom:16 },
  sidebarUser: { display:'flex', alignItems:'center', gap:10, marginBottom:14 },
  sidebarAvatar: {
    width:34, height:34,
    background:'linear-gradient(135deg,#6366f1,#4f46e5)',
    borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center',
    color:'#fff', fontWeight:700, fontSize:14, flexShrink:0,
  },
  sidebarUserName: { color:'#e2e8f0', fontSize:13, fontWeight:600 },
  sidebarUserRole: { color:'#475569', fontSize:11 },
  logoutBtn: {
    display:'flex', alignItems:'center',
    width:'100%', padding:'9px 12px',
    background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)',
    borderRadius:8, color:'#f87171', fontSize:13, fontWeight:600, cursor:'pointer',
  },

  // Main
  main: {
    marginLeft: 0,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
  },
  topbar: {
    background:'#fff', borderBottom:'1px solid #e2e8f0',
    padding:'16px 20px',
    display:'flex', alignItems:'center', justifyContent:'space-between',
    gap:12, flexWrap:'wrap',
    position:'sticky', top:0, zIndex:50,
  },
  topbarLeft: { display:'flex', alignItems:'center', gap:12 },
  topbarRight: { display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' },
  hamburger: {
    background:'none', border:'none', cursor:'pointer',
    padding:'6px', borderRadius:8,
    display:'flex', flexDirection:'column', gap:4,
    flexShrink: 0,
  },
  ham: {
    display:'block', width:20, height:2,
    background:'#475569', borderRadius:2,
  },
  pageTitle: { margin:0, fontSize:18, fontWeight:800, color:'#0f172a', letterSpacing:'-0.3px' },
  pageSub:   { margin:'2px 0 0', fontSize:12, color:'#64748b' },
  searchInput: {
    padding:'8px 12px', border:'1.5px solid #e2e8f0',
    borderRadius:9, fontSize:13, outline:'none',
    width:200, color:'#0f172a', background:'#f8fafc',
  },
  filterSelect: {
    padding:'8px 10px', border:'1.5px solid #e2e8f0',
    borderRadius:9, fontSize:13, outline:'none',
    background:'#f8fafc', color:'#0f172a', cursor:'pointer',
  },
  content: { padding:'20px 20px', flex:1 },

  // Stats
  statsRow: {
    display:'grid',
    gridTemplateColumns:'repeat(5,1fr)',
    gap:12, marginBottom:20,
  },
  statCard: {
    background:'#fff', borderRadius:14, padding:'16px',
    boxShadow:'0 1px 3px rgba(0,0,0,0.06)', border:'1px solid #f1f5f9',
  },
  statIconWrap: {
    width:36, height:36, borderRadius:10,
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:16, marginBottom:10,
  },
  statValue: { fontSize:26, fontWeight:800, lineHeight:1, marginBottom:3 },
  statLabel: { fontSize:11, color:'#64748b', fontWeight:600 },

  // Generate
  generateWrap: { display:'flex', justifyContent:'center' },
  generateCard: {
    background:'#fff', borderRadius:16, padding:'28px 28px',
    width:'100%', maxWidth:480,
    boxShadow:'0 1px 3px rgba(0,0,0,0.06)', border:'1px solid #f1f5f9',
  },
  cardTitle: { margin:'0 0 22px', fontSize:18, fontWeight:700, color:'#0f172a' },
  field: { marginBottom:16 },
  label: {
    display:'block', fontSize:11, fontWeight:700, color:'#475569',
    marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em',
  },
  input: {
    width:'100%', padding:'10px 14px',
    border:'1.5px solid #e2e8f0', borderRadius:9,
    fontSize:14, boxSizing:'border-box', outline:'none', color:'#0f172a',
  },
  err: {
    color:'#ef4444', fontSize:13, background:'#fef2f2',
    padding:'9px 12px', borderRadius:8, border:'1px solid #fecaca',
    margin:'0 0 14px',
  },
  resultBox: { borderRadius:10, padding:'14px 18px', marginBottom:16 },
  resultLabel: { fontSize:11, color:'#64748b', textTransform:'uppercase', fontWeight:700, marginBottom:4 },
  resultCode: {
    fontSize:30, fontWeight:800, letterSpacing:'0.12em',
    cursor:'pointer', display:'flex', alignItems:'center', gap:10, color:'#0f172a',
  },
  copyHint: { fontSize:11, color:'#94a3b8', fontWeight:400, letterSpacing:0 },
  resultPhone: { fontSize:13, color:'#64748b', marginTop:4 },
  primaryBtn: {
    width:'100%', padding:'12px',
    background:'linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)',
    color:'#fff', border:'none', borderRadius:10,
    fontSize:14, fontWeight:700, cursor:'pointer',
  },

  // Table
  tableCard: {
    background:'#fff', borderRadius:16,
    boxShadow:'0 1px 3px rgba(0,0,0,0.06)', border:'1px solid #f1f5f9',
    overflow:'hidden',
  },
  centerMsg: { textAlign:'center', padding:'60px 24px' },
  spinner: {
    width:32, height:32,
    border:'3px solid #e2e8f0', borderTopColor:'#6366f1',
    borderRadius:'50%', animation:'spin 0.8s linear infinite',
    margin:'0 auto 12px',
  },
  mutedText: { color:'#94a3b8', fontSize:14, margin:0 },

  // Mobile cards
  mobileCards: { display:'none', padding:16 },
  mobileCard: {
    background:'#f8fafc', borderRadius:12,
    padding:'14px 16px', marginBottom:12,
    border:'1px solid #e2e8f0',
  },
  mobileCardRow: {
    display:'flex', alignItems:'center',
    justifyContent:'space-between', gap:8, marginBottom:8,
    flexWrap:'wrap',
  },
  mobilePhone: { fontWeight:700, color:'#0f172a', fontSize:14 },
  mobileNotes: { color:'#64748b', fontSize:12 },
  mobileDomain: { marginBottom:8 },
  mobileDate: { fontSize:11, color:'#94a3b8' },

  // Desktop table
  tableWrap: { overflowX:'auto' },
  table: { width:'100%', borderCollapse:'collapse', fontSize:13 },
  th: {
    padding:'11px 14px', textAlign:'left',
    background:'#f8fafc', borderBottom:'1px solid #e2e8f0',
    fontWeight:700, color:'#475569', whiteSpace:'nowrap',
    fontSize:11, textTransform:'uppercase', letterSpacing:'0.05em',
  },
  tr: { borderBottom:'1px solid #f1f5f9' },
  td: { padding:'11px 14px', verticalAlign:'middle', color:'#1e293b' },
  phone: { fontWeight:600, color:'#0f172a' },
  codeChip: {
    background:'#ede9fe', color:'#4f46e5',
    padding:'4px 12px', borderRadius:20,
    fontWeight:700, letterSpacing:'0.1em',
    cursor:'pointer', fontSize:13, display:'inline-block',
  },
  notesText: {
    color:'#475569', fontSize:12, display:'block',
    overflow:'hidden', textOverflow:'ellipsis',
    whiteSpace:'nowrap', maxWidth:160,
  },
  domainLink: {
    color:'#6366f1', textDecoration:'none', fontWeight:500,
    fontSize:12, display:'block',
    overflow:'hidden', textOverflow:'ellipsis',
    whiteSpace:'nowrap', maxWidth:180,
  },
  badge: {
    padding:'4px 10px', borderRadius:20,
    fontSize:11, fontWeight:700, display:'inline-block', whiteSpace:'nowrap',
  },
  badgeActive:   { background:'#dcfce7', color:'#15803d' },
  badgeInactive: { background:'#fef3c7', color:'#92400e' },
  dateText: { color:'#64748b', fontSize:12 },
  muted: { color:'#cbd5e1' },
  actions: { display:'flex', gap:6 },
  revokeBtn: {
    padding:'5px 10px', background:'#fff7ed',
    border:'1px solid #fed7aa', color:'#c2410c',
    borderRadius:7, cursor:'pointer', fontSize:11, fontWeight:700, whiteSpace:'nowrap',
  },
  deleteBtn: {
    padding:'5px 10px', background:'#fef2f2',
    border:'1px solid #fecaca', color:'#dc2626',
    borderRadius:7, cursor:'pointer', fontSize:11, fontWeight:700, whiteSpace:'nowrap',
  },

  // Toast
  toast: {
    position:'fixed', bottom:24, right:24,
    color:'#fff', padding:'12px 20px', borderRadius:10,
    fontWeight:600, fontSize:14,
    boxShadow:'0 8px 24px rgba(0,0,0,0.2)', zIndex:9999,
  },
}
