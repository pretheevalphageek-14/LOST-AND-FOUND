import { useState, useEffect, useRef, CSSProperties } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
type ThemeKey = 'notebook' | 'midnight' | 'sunset' | 'mint'
type ScreenKey = 'today' | 'timetable' | 'bunk' | 'sgpa' | 'internals' | 'focus'

interface Tok {
  name: string; bg: string; primary: string; card: string
  accent: string; accentFg: string; success: string; danger: string
  text: string; muted: string; border: string
  blob1: string; blob2: string; blob3: string
}

// ─── Themes ───────────────────────────────────────────────────────────────────
const THEMES: Record<ThemeKey, Tok> = {
  notebook: {
    name: 'Notebook', bg: '#F2F4F8', primary: '#1B2140', card: '#FFFFFF',
    accent: '#FFD23F', accentFg: '#1B2140', success: '#2FBF88', danger: '#FF5A5F',
    text: '#1B2140', muted: '#6B7591', border: '#E2E6EF',
    blob1: 'rgba(255,210,63,0.38)', blob2: 'rgba(47,191,136,0.3)', blob3: 'rgba(255,90,95,0.25)',
  },
  midnight: {
    name: 'Midnight', bg: '#0F1222', primary: '#0B0E1C', card: '#171B2E',
    accent: '#C6FF3D', accentFg: '#0B0E1C', success: '#2FBF88', danger: '#FF5A5F',
    text: '#E8ECF4', muted: '#6B7A99', border: '#252A42',
    blob1: 'rgba(198,255,61,0.18)', blob2: 'rgba(139,92,246,0.22)', blob3: 'rgba(236,72,153,0.18)',
  },
  sunset: {
    name: 'Sunset', bg: '#FFF7F0', primary: '#3A2A22', card: '#FFFFFF',
    accent: '#FF7A45', accentFg: '#FFFFFF', success: '#2FBF88', danger: '#FF5A5F',
    text: '#3A2A22', muted: '#9B7060', border: '#F0E0D6',
    blob1: 'rgba(255,122,69,0.3)', blob2: 'rgba(251,191,36,0.25)', blob3: 'rgba(248,113,113,0.2)',
  },
  mint: {
    name: 'Mint', bg: '#F0FBF6', primary: '#0B3D2E', card: '#FFFFFF',
    accent: '#12B886', accentFg: '#FFFFFF', success: '#12B886', danger: '#FF5A5F',
    text: '#0B3D2E', muted: '#4B8B6E', border: '#C3E8D8',
    blob1: 'rgba(18,184,134,0.28)', blob2: 'rgba(6,182,212,0.22)', blob3: 'rgba(132,204,22,0.2)',
  },
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = {
  today: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="10" cy="10" r="7.5"/><path d="M10 6.5v3.5l2.5 2"/></svg>,
  timetable: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="3.5" width="15" height="13" rx="2"/><path d="M2.5 8h15M7.5 8v8.5"/></svg>,
  bunk: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="10" cy="10" r="7.5"/><path d="M6.5 10h7M10 13a3 3 0 0 0 3-3" opacity="0.5"/><path d="M6.5 12.5c.8 1.5 2 2.5 3.5 2.5s2.7-1 3.5-2.5"/></svg>,
  sgpa: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14.5l4-5 3 3 3-6 4 4.5"/></svg>,
  internals: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="4" y="2.5" width="12" height="15" rx="1.5" strokeLinejoin="round"/><path d="M7 7h6M7 10.5h6M7 14h3.5"/></svg>,
  focus: () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="10" cy="10" r="7.5"/><path d="M8.5 7.5l5 2.5-5 2.5v-5z" fill="currentColor" stroke="none"/></svg>,
  palette: () => <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="6" cy="7" r="1.5" fill="currentColor"/><circle cx="10.5" cy="5.5" r="1.5" fill="currentColor"/><circle cx="12" cy="10" r="1.5" fill="currentColor"/><circle cx="7" cy="12" r="1.5" fill="currentColor"/></svg>,
  plus: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6.5 1.5v10M1.5 6.5h10"/></svg>,
  trash: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 3.5h10M4.5 3.5V2.5h4V3.5M4 3.5l.5 7.5h4l.5-7.5"/></svg>,
  check: () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 6l3 3 6-6"/></svg>,
  warn: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 1L12.5 12H.5L6.5 1z"/><path d="M6.5 5v3M6.5 9.5v.5"/></svg>,
}

const NAV: { key: ScreenKey; label: string; Icon: () => React.ReactElement }[] = [
  { key: 'today', label: 'Today', Icon: Ic.today },
  { key: 'timetable', label: 'Timetable', Icon: Ic.timetable },
  { key: 'bunk', label: 'Bunk calc', Icon: Ic.bunk },
  { key: 'sgpa', label: 'SGPA/CGPA', Icon: Ic.sgpa },
  { key: 'internals', label: 'Internals', Icon: Ic.internals },
  { key: 'focus', label: 'Focus', Icon: Ic.focus },
]

// ─── Blob Background ──────────────────────────────────────────────────────────
function BlobBg({ t }: { t: Tok }) {
  const targetRef = useRef({ x: 400, y: 300 })
  const curRef = useRef({ x: 400, y: 300 })
  const [pos, setPos] = useState({ x: 400, y: 300 })
  const rafRef = useRef(0)

  useEffect(() => {
    targetRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    curRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const onMouse = (e: MouseEvent) => { targetRef.current = { x: e.clientX, y: e.clientY } }
    const onTouch = (e: TouchEvent) => { if (e.touches[0]) targetRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch, { passive: true })
    const tick = () => {
      const c = curRef.current; const p = targetRef.current
      curRef.current = { x: c.x + (p.x - c.x) * 0.04, y: c.y + (p.y - c.y) * 0.04 }
      setPos({ ...curRef.current })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMouse); window.removeEventListener('touchmove', onTouch); cancelAnimationFrame(rafRef.current) }
  }, [])

  const blob = (dx: number, dy: number, color: string): CSSProperties => ({
    position: 'absolute', width: 360, height: 360, borderRadius: '50%',
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    filter: 'blur(70px)',
    left: pos.x + dx - 180, top: pos.y + dy - 180,
    pointerEvents: 'none',
  })

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={blob(0, 0, t.blob1)} />
      <div style={blob(-160, 90, t.blob2)} />
      <div style={blob(130, -110, t.blob3)} />
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ t, screen, onNav }: { t: Tok; screen: ScreenKey; onNav: (s: ScreenKey) => void }) {
  return (
    <aside style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 220, background: t.primary, zIndex: 40, flexDirection: 'column', padding: '24px 0' }}
      className="hidden md:flex">
      <div style={{ padding: '0 20px 28px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ background: t.accent, color: t.accentFg, borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 18, transform: 'rotate(-6deg)', flexShrink: 0 }}>B</div>
        <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 20, color: '#fff' }}>Bunkr</span>
      </div>
      <nav style={{ flex: 1, padding: '0 10px' }}>
        {NAV.map(({ key, label, Icon }) => {
          const active = screen === key
          return (
            <button key={key} onClick={() => onNav(key)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, marginBottom: 3, background: active ? `${t.accent}28` : 'transparent', color: active ? t.accent : 'rgba(255,255,255,0.6)', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter, sans-serif', fontWeight: active ? 600 : 400, fontSize: 14, transition: 'all 0.15s' }}>
              <Icon />
              {label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────
function BottomBar({ t, screen, onNav }: { t: Tok; screen: ScreenKey; onNav: (s: ScreenKey) => void }) {
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, background: `${t.primary}ee`, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', display: 'flex', borderTop: `1px solid rgba(255,255,255,0.08)` }} className="md:hidden">
      {NAV.map(({ key, label, Icon }) => {
        const active = screen === key
        return (
          <button key={key} onClick={() => onNav(key)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 2px 12px', color: active ? t.accent : 'rgba(255,255,255,0.5)', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: active ? 600 : 400, transition: 'color 0.15s', letterSpacing: '0.01em' }}>
            <Icon />
            {label}
          </button>
        )
      })}
    </nav>
  )
}

// ─── Screen Titles ────────────────────────────────────────────────────────────
const TITLES: Record<ScreenKey, string> = {
  today: 'Today', timetable: 'Timetable', bunk: 'Bunk calc',
  sgpa: 'SGPA / CGPA', internals: 'Internals', focus: 'Focus',
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ t, screen, theme, onTheme, showPicker, onTogglePicker }: {
  t: Tok; screen: ScreenKey; theme: ThemeKey
  onTheme: (k: ThemeKey) => void; showPicker: boolean; onTogglePicker: () => void
}) {
  const h = new Date().getHours()
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <header style={{ padding: '20px 20px 0', position: 'relative', zIndex: 10 }}>
      {screen === 'today' && (
        <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 13, color: t.muted, marginBottom: 2 }}>
          {greeting}, Arjun 👋
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 28, color: t.text, lineHeight: 1.2 }}>
          {TITLES[screen]}
        </h1>
        <div style={{ position: 'relative' }}>
          <button onClick={onTogglePicker} style={{ width: 36, height: 36, borderRadius: '50%', background: t.card, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: t.muted }}>
            <Ic.palette />
          </button>
          {showPicker && (
            <div style={{ position: 'absolute', right: 0, top: 44, background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: '10px 12px', display: 'flex', gap: 8, zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.14)' }}>
              {(Object.keys(THEMES) as ThemeKey[]).map(k => (
                <button key={k} onClick={() => { onTheme(k); onTogglePicker() }} title={THEMES[k].name}
                  style={{ width: 26, height: 26, borderRadius: '50%', background: THEMES[k].accent, border: theme === k ? `3px solid ${t.text}` : '3px solid transparent', cursor: 'pointer', transition: 'border 0.15s', outline: 'none' }} />
              ))}
            </div>
          )}
        </div>
      </div>
      {screen === 'today' && (
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 500, fontSize: 12, color: t.muted, marginTop: 3 }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      )}
    </header>
  )
}

// ─── Card helper ──────────────────────────────────────────────────────────────
const mkCard = (t: Tok, extra?: CSSProperties): CSSProperties => ({
  background: t.card, border: `1px solid ${t.border}`, borderRadius: 14,
  padding: '16px 20px', position: 'relative', zIndex: 1, ...extra,
})

// ─── Today Screen ─────────────────────────────────────────────────────────────
const TODAY_CLASSES = [
  { subject: 'Mathematics', time: '8:30', status: 'done' as const },
  { subject: 'Data Structures', time: '9:30', status: 'now' as const },
  { subject: 'DBMS', time: '11:30', status: 'upcoming' as const },
  { subject: 'Operating Systems', time: '2:00 PM', status: 'upcoming' as const },
]

const DEADLINES_INIT = [
  { name: 'End-term Exam (CS3001)', daysLeft: 12 },
  { name: 'DBMS Assignment submission', daysLeft: 3 },
  { name: 'Circuit Lab Record', daysLeft: 2 },
]

function TodayScreen({ t, onNav }: { t: Tok; onNav: (s: ScreenKey) => void }) {
  const [deadlines, setDeadlines] = useState(DEADLINES_INIT)
  const [newDeadline, setNewDeadline] = useState('')
  const [newDays, setNewDays] = useState('')

  const addDeadline = () => {
    if (newDeadline.trim()) {
      setDeadlines(d => [...d, { name: newDeadline.trim(), daysLeft: parseInt(newDays) || 7 }])
      setNewDeadline('')
      setNewDays('')
    }
  }

  const inputStyle: CSSProperties = {
    flex: 1, background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '7px 10px',
    fontFamily: 'Inter, sans-serif', fontSize: 13, color: t.text, outline: 'none',
  }

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Up next */}
      <div style={{ ...mkCard(t), background: t.primary, border: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 600, color: t.accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Up next</span>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 20, color: '#fff', marginTop: 4 }}>Data Structures</h2>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>9:30 AM · Room 204</p>
          </div>
          <span style={{ background: `${t.accent}28`, color: t.accent, fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 100, whiteSpace: 'nowrap' }}>
            in 12 min
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={mkCard(t)}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: t.muted, marginBottom: 6 }}>Overall attendance</p>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: 30, color: t.success, lineHeight: 1 }}>78.3%</p>
        </div>
        <div style={mkCard(t)}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: t.muted, marginBottom: 6 }}>Current SGPA</p>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: 30, color: t.accent, lineHeight: 1 }}>8.40</p>
        </div>
      </div>

      {/* Today's classes */}
      <div style={mkCard(t)}>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15, color: t.text, marginBottom: 14 }}>Today's classes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TODAY_CLASSES.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: c.status === 'done' ? 0.45 : 1 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: c.status === 'done' ? t.muted : c.status === 'now' ? t.accent : t.border, boxShadow: c.status === 'now' ? `0 0 0 3px ${t.accent}30` : 'none' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: t.text, flex: 1, textDecoration: c.status === 'done' ? 'line-through' : 'none' }}>{c.subject}</span>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: t.muted }}>{c.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Exams & deadlines */}
      <div style={mkCard(t)}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15, color: t.text }}>Exams & deadlines</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {deadlines.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: t.text }}>{d.name}</p>
              </div>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 100, background: d.daysLeft <= 3 ? `${t.danger}18` : `${t.muted}18`, color: d.daysLeft <= 3 ? t.danger : t.muted, whiteSpace: 'nowrap' }}>
                {d.daysLeft}d left
              </span>
              <button onClick={() => setDeadlines(dl => dl.filter((_, j) => j !== i))} style={{ color: t.danger, background: `${t.danger}14`, border: 'none', borderRadius: 6, padding: '4px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Ic.trash />
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${t.border}` }}>
          <input value={newDeadline} onChange={e => setNewDeadline(e.target.value)} onKeyDown={e => e.key === 'Enter' && addDeadline()} placeholder="Add deadline..." style={inputStyle} />
          <input value={newDays} onChange={e => setNewDays(e.target.value)} placeholder="days" type="number" style={{ ...inputStyle, flex: '0 0 60px', textAlign: 'center' }} />
          <button onClick={addDeadline} style={{ background: t.accent, color: t.accentFg, border: 'none', borderRadius: 8, padding: '0 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13 }}>
            <Ic.plus /> Add
          </button>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: t.muted, marginBottom: 10, fontWeight: 500 }}>Quick links</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['bunk', 'sgpa', 'internals', 'focus'] as ScreenKey[]).map(s => (
            <button key={s} onClick={() => onNav(s)} style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: t.text, background: t.card, border: `1px solid ${t.border}`, borderRadius: 100, padding: '6px 14px', cursor: 'pointer', zIndex: 1, position: 'relative' }}>
              {TITLES[s]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 16 }} />
    </div>
  )
}

// ─── Timetable Screen ─────────────────────────────────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const SLOTS = ['8:30', '9:30', '10:30', '11:30', '12:30', '1:30', '2:30', '3:30']
type TGrid = Record<string, Record<string, string>>

const DEFAULT_GRID: TGrid = {
  Mon: { '8:30': 'Maths', '9:30': 'Data Structures', '11:30': 'DBMS', '2:30': 'OS Lab' },
  Tue: { '8:30': 'Comp Networks', '10:30': 'TOC', '1:30': 'DBMS Lab' },
  Wed: { '8:30': 'Maths', '9:30': 'Data Structures', '11:30': 'OS', '2:30': 'Comp Networks' },
  Thu: { '9:30': 'TOC', '10:30': 'OS', '1:30': 'DS Lab' },
  Fri: { '8:30': 'Maths', '11:30': 'DBMS', '2:30': 'Comp Networks' },
  Sat: { '9:30': 'Physics Lab', '10:30': 'Physics Lab' },
}

function TimetableScreen({ t }: { t: Tok }) {
  const [mode, setMode] = useState<'grid' | 'text' | 'pdf'>('grid')
  const [grid, setGrid] = useState<TGrid>(DEFAULT_GRID)
  const [editing, setEditing] = useState<{ day: string; slot: string } | null>(null)
  const [editVal, setEditVal] = useState('')
  const [pasteText, setPasteText] = useState('')

  const today = DAYS[new Date().getDay() - 1] ?? 'Mon'

  const subjectColor = (subj: string) => {
    const palette = [t.accent, t.success, t.danger, `${t.accent}88`, `${t.success}88`]
    const i = subj.charCodeAt(0) % palette.length
    return palette[i]
  }

  const segBtn = (m: typeof mode, label: string) => (
    <button onClick={() => setMode(m)} style={{ flex: 1, padding: '8px 0', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: mode === m ? 600 : 400, color: mode === m ? t.accentFg : t.muted, background: mode === m ? t.accent : 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s' }}>
      {label}
    </button>
  )

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Segmented control */}
      <div style={{ ...mkCard(t), padding: '6px', display: 'flex', gap: 4 }}>
        {segBtn('grid', 'Grid')}
        {segBtn('text', 'Paste text')}
        {segBtn('pdf', 'PDF upload')}
      </div>

      {mode === 'grid' && (
        <div style={mkCard(t, { padding: '14px', overflowX: 'auto' })}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: t.muted, fontWeight: 500, textAlign: 'left', padding: '4px 6px', width: 44 }}>
                  Time
                </th>
                {DAYS.map(d => (
                  <th key={d} style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: d === today ? 700 : 500, color: d === today ? t.accent : t.muted, textAlign: 'center', padding: '4px 2px', minWidth: 70 }}>
                    {d}
                    {d === today && <span style={{ display: 'block', width: 4, height: 4, borderRadius: '50%', background: t.accent, margin: '2px auto 0' }} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map(slot => (
                <tr key={slot}>
                  <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: t.muted, fontWeight: 500, padding: '4px 4px', verticalAlign: 'middle' }}>{slot}</td>
                  {DAYS.map(day => {
                    const subj = grid[day]?.[slot]
                    const isEditing = editing?.day === day && editing?.slot === slot
                    return (
                      <td key={day} style={{ padding: '3px', verticalAlign: 'middle' }}
                        onClick={() => { setEditing({ day, slot }); setEditVal(subj ?? '') }}>
                        {isEditing ? (
                          <input
                            autoFocus
                            value={editVal}
                            onChange={e => setEditVal(e.target.value)}
                            onBlur={() => {
                              setGrid(g => { const ng = { ...g, [day]: { ...g[day] } }; if (editVal.trim()) ng[day][slot] = editVal.trim(); else delete ng[day][slot]; return ng })
                              setEditing(null)
                            }}
                            onKeyDown={e => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                            style={{ width: '100%', fontFamily: 'Inter, sans-serif', fontSize: 11, background: `${t.accent}18`, border: `1px solid ${t.accent}`, borderRadius: 6, padding: '4px 5px', color: t.text, outline: 'none' }}
                          />
                        ) : subj ? (
                          <div style={{ background: `${subjectColor(subj)}22`, borderRadius: 6, padding: '5px 6px', textAlign: 'center', cursor: 'pointer' }}>
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 500, color: subjectColor(subj), lineHeight: 1.3 }}>{subj}</span>
                          </div>
                        ) : (
                          <div style={{ height: 28, borderRadius: 6, cursor: 'pointer', border: `1px dashed ${t.border}` }} />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: t.muted, marginTop: 12, textAlign: 'center' }}>Tap any cell to edit</p>
        </div>
      )}

      {mode === 'text' && (
        <div style={mkCard(t)}>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15, color: t.text, marginBottom: 6 }}>Paste your timetable</h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: t.muted, marginBottom: 12 }}>
            Format: one class per line — <span style={{ fontFamily: 'IBM Plex Mono, monospace' }}>DAY HH:MM Subject</span><br />
            e.g. <span style={{ fontFamily: 'IBM Plex Mono, monospace' }}>Mon 9:30 Data Structures</span>
          </p>
          <textarea
            value={pasteText}
            onChange={e => setPasteText(e.target.value)}
            placeholder={"Mon 8:30 Mathematics\nMon 9:30 Data Structures\nTue 10:30 TOC\n..."}
            style={{ width: '100%', minHeight: 180, background: t.bg, border: `1px solid ${t.border}`, borderRadius: 10, padding: '12px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: t.text, resize: 'vertical', outline: 'none' }}
          />
          <button
            onClick={() => {
              const ng: TGrid = {}
              pasteText.split('\n').forEach(line => {
                const parts = line.trim().split(/\s+/)
                if (parts.length >= 3) {
                  const [day, slot, ...rest] = parts
                  const d = day.charAt(0).toUpperCase() + day.slice(1, 3).toLowerCase()
                  if (DAYS.includes(d)) { if (!ng[d]) ng[d] = {}; ng[d][slot] = rest.join(' ') }
                }
              })
              setGrid(g => ({ ...g, ...ng }))
              setMode('grid')
            }}
            style={{ marginTop: 12, background: t.accent, color: t.accentFg, border: 'none', borderRadius: 10, padding: '10px 20px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer', width: '100%' }}>
            Parse into timetable →
          </button>
        </div>
      )}

      {mode === 'pdf' && (
        <div style={mkCard(t)}>
          <div style={{ border: `2px dashed ${t.border}`, borderRadius: 12, padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>📄</p>
            <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 8 }}>Drop your PDF here</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: t.muted, marginBottom: 16, lineHeight: 1.5 }}>
              Text extraction from PDFs may need manual review — best results with copy-paste text timetables.
            </p>
            <button style={{ background: t.accent, color: t.accentFg, border: 'none', borderRadius: 10, padding: '10px 24px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Choose PDF file
            </button>
          </div>
        </div>
      )}

      <div style={{ height: 16 }} />
    </div>
  )
}

// ─── Bunk Screen ──────────────────────────────────────────────────────────────
interface BunkSubject { name: string; held: number; attended: number; required: number }

const BUNK_INIT: BunkSubject[] = [
  { name: 'Data Structures', held: 34, attended: 28, required: 75 },
  { name: 'DBMS', held: 31, attended: 20, required: 75 },
  { name: 'Operating Systems', held: 30, attended: 25, required: 75 },
  { name: 'Computer Networks', held: 24, attended: 18, required: 75 },
  { name: 'Mathematics', held: 38, attended: 32, required: 75 },
]

function BunkScreen({ t }: { t: Tok }) {
  const [subjects, setSubjects] = useState<BunkSubject[]>(BUNK_INIT)

  const update = (i: number, field: keyof BunkSubject, val: number | string) => {
    setSubjects(s => s.map((sub, j) => j === i ? { ...sub, [field]: typeof val === 'string' ? val : Math.max(0, val) } : sub))
  }

  const niStyle = (w = 44): CSSProperties => ({
    fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: 15,
    width: w, textAlign: 'center', background: t.bg, border: `1px solid ${t.border}`,
    borderRadius: 8, padding: '5px 4px', color: t.text, outline: 'none',
  })

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {subjects.map((sub, i) => {
        const pct = sub.held > 0 ? (sub.attended / sub.held) * 100 : 0
        const req = sub.required / 100
        const canBunk = pct >= sub.required ? Math.floor((sub.attended - req * sub.held) / req) : 0
        const needAttend = pct < sub.required ? Math.ceil((req * sub.held - sub.attended) / (1 - req)) : 0
        const safe = pct >= sub.required

        return (
          <div key={i} style={mkCard(t)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15, color: t.text }}>{sub.name}</h3>
              <button onClick={() => setSubjects(s => s.filter((_, j) => j !== i))} style={{ color: t.danger, background: `${t.danger}14`, border: 'none', borderRadius: 6, padding: '4px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Ic.trash />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: t.muted, marginBottom: 3 }}>Attended</p>
                <input type="number" value={sub.attended} onChange={e => update(i, 'attended', Math.min(parseInt(e.target.value) || 0, sub.held))} style={niStyle()} />
              </div>
              <span style={{ color: t.muted, fontFamily: 'IBM Plex Mono, monospace', fontSize: 16 }}>/</span>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: t.muted, marginBottom: 3 }}>Held</p>
                <input type="number" value={sub.held} onChange={e => update(i, 'held', parseInt(e.target.value) || 0)} style={niStyle()} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: t.muted, marginBottom: 3 }}>Required %</p>
                <input type="number" value={sub.required} onChange={e => update(i, 'required', parseInt(e.target.value) || 0)} style={niStyle(52)} />
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: 22, color: safe ? t.success : t.danger }}>
                  {pct.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 6, background: t.bg, borderRadius: 100, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: safe ? t.success : t.danger, borderRadius: 100, transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ height: 2, background: 'transparent', position: 'relative', marginBottom: 12 }}>
              <div style={{ position: 'absolute', left: `${sub.required}%`, top: -8, height: 14, width: 2, background: t.muted, borderRadius: 1, opacity: 0.4 }} />
            </div>

            {/* Result banner */}
            <div style={{ background: safe ? `${t.success}18` : `${t.danger}14`, borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: safe ? t.success : t.danger }}>
                {safe ? <Ic.check /> : <Ic.warn />}
              </span>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: safe ? t.success : t.danger }}>
                {safe
                  ? `You can skip ${canBunk} more class${canBunk !== 1 ? 'es' : ''}`
                  : `Attend next ${needAttend} class${needAttend !== 1 ? 'es' : ''} to recover`}
              </p>
            </div>
          </div>
        )
      })}

      <button
        onClick={() => setSubjects(s => [...s, { name: 'New Subject', held: 0, attended: 0, required: 75 }])}
        style={{ background: 'transparent', border: `1.5px dashed ${t.border}`, borderRadius: 14, padding: '14px', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: t.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, zIndex: 1, position: 'relative' }}>
        <Ic.plus /> Add subject
      </button>
      <div style={{ height: 16 }} />
    </div>
  )
}

// ─── SGPA / CGPA Screen ───────────────────────────────────────────────────────
const GRADES = ['O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F']
const GRADE_POINTS: Record<string, number> = { O: 10, 'A+': 9, A: 8, 'B+': 7, B: 6, C: 5, P: 4, F: 0 }

interface SubjectRow { name: string; credits: number; grade: string }
interface SemRow { label: string; sgpa: number; credits: number }

const SUBJECTS_INIT: SubjectRow[] = [
  { name: 'Data Structures', credits: 4, grade: 'O' },
  { name: 'DBMS', credits: 3, grade: 'A+' },
  { name: 'Operating Systems', credits: 3, grade: 'A' },
  { name: 'Computer Networks', credits: 3, grade: 'A+' },
  { name: 'Mathematics III', credits: 4, grade: 'B+' },
  { name: 'Physics Lab', credits: 1, grade: 'A' },
]

const SEMS_INIT: SemRow[] = [
  { label: 'Sem 1', sgpa: 8.2, credits: 20 },
  { label: 'Sem 2', sgpa: 8.7, credits: 22 },
  { label: 'Sem 3 (current)', sgpa: 0, credits: 18 },
]

function SGPAScreen({ t }: { t: Tok }) {
  const [subjects, setSubjects] = useState<SubjectRow[]>(SUBJECTS_INIT)
  const [sems, setSems] = useState<SemRow[]>(SEMS_INIT)
  const [targetCGPA, setTargetCGPA] = useState('9.0')
  const [credsDone, setCredsDone] = useState('42')
  const [credsRemaining, setCredsRemaining] = useState('20')

  const totalCredits = subjects.reduce((s, r) => s + r.credits, 0)
  const totalPoints = subjects.reduce((s, r) => s + r.credits * GRADE_POINTS[r.grade], 0)
  const sgpa = totalCredits > 0 ? totalPoints / totalCredits : 0

  const updatedSems = sems.map((s, i) => i === sems.length - 1 ? { ...s, sgpa } : s)
  const totalSemCredits = updatedSems.reduce((s, r) => s + r.credits, 0)
  const totalSemPoints = updatedSems.reduce((s, r) => s + r.sgpa * r.credits, 0)
  const cgpa = totalSemCredits > 0 ? totalSemPoints / totalSemCredits : 0

  const currentCGPA = cgpa
  const cd = parseFloat(credsDone) || 0
  const cr = parseFloat(credsRemaining) || 0
  const tc = parseFloat(targetCGPA) || 0
  const neededSGPA = cr > 0 ? (tc * (cd + cr) - currentCGPA * cd) / cr : 0

  const inputRow: CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${t.border}` }
  const siStyle = (width = 50): CSSProperties => ({
    width, fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 500,
    background: t.bg, border: `1px solid ${t.border}`, borderRadius: 7,
    padding: '5px 6px', color: t.text, outline: 'none', textAlign: 'center',
  })

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* SGPA */}
      <div style={mkCard(t)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15, color: t.text }}>Current semester (SGPA)</h3>
        </div>

        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 48px 70px 24px', gap: 8, padding: '0 0 6px', borderBottom: `1px solid ${t.border}`, marginBottom: 4 }}>
          {['Subject', 'Cr.', 'Grade', ''].map(h => (
            <span key={h} style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: t.muted, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>

        {subjects.map((sub, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 48px 70px 24px', gap: 8, alignItems: 'center', padding: '5px 0', borderBottom: `1px solid ${t.border}40` }}>
            <input value={sub.name} onChange={e => setSubjects(s => s.map((r, j) => j === i ? { ...r, name: e.target.value } : r))}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, background: 'transparent', border: 'none', color: t.text, outline: 'none', width: '100%' }} />
            <input type="number" value={sub.credits} onChange={e => setSubjects(s => s.map((r, j) => j === i ? { ...r, credits: parseInt(e.target.value) || 0 } : r))}
              style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 500, background: t.bg, border: `1px solid ${t.border}`, borderRadius: 6, padding: '4px 4px', color: t.text, outline: 'none', textAlign: 'center', width: '100%' }} />
            <select value={sub.grade} onChange={e => setSubjects(s => s.map((r, j) => j === i ? { ...r, grade: e.target.value } : r))}
              style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 600, background: t.bg, border: `1px solid ${t.border}`, borderRadius: 6, padding: '4px 4px', color: t.accent, outline: 'none' }}>
              {GRADES.map(g => <option key={g} value={g}>{g} ({GRADE_POINTS[g]})</option>)}
            </select>
            <button onClick={() => setSubjects(s => s.filter((_, j) => j !== i))} style={{ color: t.danger, background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}>
              <Ic.trash />
            </button>
          </div>
        ))}

        <button onClick={() => setSubjects(s => [...s, { name: 'Subject', credits: 3, grade: 'A' }])}
          style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, color: t.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
          <Ic.plus /> Add subject
        </button>

        <div style={{ marginTop: 16, background: t.primary, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>SGPA</span>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: 32, color: t.accent }}>{sgpa.toFixed(2)}</span>
        </div>
      </div>

      {/* CGPA */}
      <div style={mkCard(t)}>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15, color: t.text, marginBottom: 14 }}>Semester history (CGPA)</h3>

        {updatedSems.map((sem, i) => (
          <div key={i} style={{ ...inputRow, borderBottom: i < sems.length - 1 ? `1px solid ${t.border}` : 'none' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: t.muted, flex: '0 0 80px' }}>{sem.label}</span>
            <input
              readOnly={i === sems.length - 1}
              value={sem.sgpa.toFixed(2)}
              onChange={e => setSems(s => s.map((r, j) => j === i ? { ...r, sgpa: parseFloat(e.target.value) || 0 } : r))}
              style={{ ...siStyle(64), fontWeight: 600, background: i === sems.length - 1 ? `${t.accent}18` : t.bg, color: i === sems.length - 1 ? t.accent : t.text }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: t.muted }}>×</span>
            <input
              type="number"
              value={sem.credits}
              onChange={e => setSems(s => s.map((r, j) => j === i ? { ...r, credits: parseInt(e.target.value) || 0 } : r))}
              style={siStyle(52)} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: t.muted }}>cr</span>
          </div>
        ))}

        <button onClick={() => setSems(s => [...s.slice(0, -1), { label: `Sem ${s.length}`, sgpa: 0, credits: 20 }, s[s.length - 1]])}
          style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, color: t.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
          <Ic.plus /> Add semester
        </button>

        <div style={{ marginTop: 16, background: t.primary, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>CGPA</span>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: 32, color: t.accent }}>{cgpa.toFixed(2)}</span>
        </div>
      </div>

      {/* Target planner */}
      <div style={mkCard(t)}>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15, color: t.text, marginBottom: 14 }}>Target CGPA planner</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
          {[
            { label: 'Current CGPA', value: currentCGPA.toFixed(2), readOnly: true },
            { label: 'Credits done', value: credsDone, onChange: setCredsDone },
            { label: 'Target CGPA', value: targetCGPA, onChange: setTargetCGPA },
            { label: 'Credits left', value: credsRemaining, onChange: setCredsRemaining },
          ].map(({ label, value, readOnly, onChange }) => (
            <div key={label}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: t.muted, marginBottom: 4 }}>{label}</p>
              <input value={value} readOnly={readOnly} onChange={e => onChange && onChange(e.target.value)}
                style={{ width: '100%', fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, fontWeight: 600, background: readOnly ? `${t.success}14` : t.bg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '7px 8px', color: readOnly ? t.success : t.text, outline: 'none', textAlign: 'center' }} />
            </div>
          ))}
        </div>
        <div style={{ background: neededSGPA > 10 ? `${t.danger}14` : `${t.accent}14`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: t.text }}>Average SGPA needed</span>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: 24, color: neededSGPA > 10 ? t.danger : t.accent }}>
            {neededSGPA > 0 ? neededSGPA.toFixed(2) : '—'}
          </span>
        </div>
        {neededSGPA > 10 && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: t.danger, marginTop: 8 }}>Target may not be achievable — try a lower target or more credits.</p>}
      </div>

      <div style={{ height: 16 }} />
    </div>
  )
}

// ─── Internals Screen ─────────────────────────────────────────────────────────
interface InternalRow { name: string; max: number; scored: number }

const INTERNALS_INIT: InternalRow[] = [
  { name: 'Mid-term Test', max: 50, scored: 43 },
  { name: 'Assignment', max: 20, scored: 18 },
  { name: 'Quiz', max: 15, scored: 12 },
  { name: 'Lab Record', max: 15, scored: 14 },
]

function InternalsScreen({ t }: { t: Tok }) {
  const [rows, setRows] = useState<InternalRow[]>(INTERNALS_INIT)
  const [scaleTo, setScaleTo] = useState('25')

  const totalMax = rows.reduce((s, r) => s + r.max, 0)
  const totalScored = rows.reduce((s, r) => s + r.scored, 0)
  const pct = totalMax > 0 ? (totalScored / totalMax) * 100 : 0
  const scale = parseFloat(scaleTo) || 0
  const scaled = scale > 0 ? (totalScored / totalMax) * scale : null

  const numIn = (val: number, onChange: (n: number) => void, width = 56) => (
    <input type="number" value={val}
      onChange={e => onChange(Math.max(0, parseInt(e.target.value) || 0))}
      style={{ width, fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, fontWeight: 500, background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '6px 6px', color: t.text, outline: 'none', textAlign: 'center' }} />
  )

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={mkCard(t)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px 64px 24px', gap: 10, padding: '0 0 8px', borderBottom: `1px solid ${t.border}`, marginBottom: 4 }}>
          {['Component', 'Max', 'Scored', ''].map(h => (
            <span key={h} style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: t.muted, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>

        {rows.map((row, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 64px 64px 24px', gap: 10, alignItems: 'center', padding: '7px 0', borderBottom: `1px solid ${t.border}40` }}>
            <input value={row.name} onChange={e => setRows(r => r.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, background: 'transparent', border: 'none', color: t.text, outline: 'none', width: '100%' }} />
            {numIn(row.max, v => setRows(r => r.map((x, j) => j === i ? { ...x, max: v } : x)))}
            {numIn(Math.min(row.scored, row.max), v => setRows(r => r.map((x, j) => j === i ? { ...x, scored: Math.min(v, row.max) } : x)))}
            <button onClick={() => setRows(r => r.filter((_, j) => j !== i))} style={{ color: t.danger, background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}>
              <Ic.trash />
            </button>
          </div>
        ))}

        <button onClick={() => setRows(r => [...r, { name: 'Component', max: 20, scored: 0 }])}
          style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, color: t.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
          <Ic.plus /> Add component
        </button>
      </div>

      {/* Scale to field */}
      <div style={mkCard(t, { display: 'flex', alignItems: 'center', gap: 12 })}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: t.muted, flex: 1 }}>Scale total to</span>
        <input type="number" value={scaleTo} onChange={e => setScaleTo(e.target.value)}
          style={{ width: 72, fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, fontWeight: 600, background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '7px 8px', color: t.text, outline: 'none', textAlign: 'center' }} />
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: t.muted }}>marks (optional)</span>
      </div>

      {/* Result */}
      <div style={{ background: t.primary, border: 'none', borderRadius: 14, padding: '20px 24px', zIndex: 1, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Raw score</p>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: 22, color: '#fff' }}>
              {totalScored} / {totalMax}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Percentage</p>
            <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: 22, color: t.accent }}>
              {pct.toFixed(1)}%
            </p>
          </div>
        </div>
        {scaled !== null && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Scaled to {scale}</span>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: 36, color: t.accent }}>{scaled.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div style={{ height: 16 }} />
    </div>
  )
}

// ─── Focus Timer Screen ───────────────────────────────────────────────────────
const FOCUS_DURATIONS = { focus: 25 * 60, break: 5 * 60 }

function FocusScreen({ t }: { t: Tok }) {
  const [mode, setMode] = useState<'focus' | 'break'>('focus')
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATIONS.focus)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef<number | null>(null)

  const total = FOCUS_DURATIONS[mode]
  const progress = timeLeft / total
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const secs = (timeLeft % 60).toString().padStart(2, '0')

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setRunning(false)
            if (mode === 'focus') setSessions(s => s + 1)
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, mode])

  const switchMode = (m: 'focus' | 'break') => {
    setMode(m)
    setTimeLeft(FOCUS_DURATIONS[m])
    setRunning(false)
  }

  const r = 90
  const circumference = 2 * Math.PI * r
  const dashOffset = circumference * (1 - progress)

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>

      {/* Mode toggle */}
      <div style={{ ...mkCard(t, { padding: '6px', display: 'flex', gap: 4, width: '100%', maxWidth: 360 }) }}>
        {(['focus', 'break'] as const).map(m => (
          <button key={m} onClick={() => switchMode(m)}
            style={{ flex: 1, padding: '8px 0', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: mode === m ? 600 : 400, color: mode === m ? t.accentFg : t.muted, background: mode === m ? t.accent : 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize' }}>
            {m === 'focus' ? 'Focus block' : 'Short break'} {m === 'focus' ? '25m' : '5m'}
          </button>
        ))}
      </div>

      {/* Timer ring */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16, zIndex: 1 }}>
        <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="110" cy="110" r={r} fill="none" stroke={t.border} strokeWidth="8" />
          <circle cx="110" cy="110" r={r} fill="none" stroke={t.accent} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.9s ease' }} />
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: 48, color: t.text, lineHeight: 1, letterSpacing: '-0.02em' }}>
            {mins}:{secs}
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: t.muted, marginTop: 6 }}>
            {mode === 'focus' ? 'Focus block' : 'Short break'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginTop: 8, zIndex: 1 }}>
        <button
          onClick={() => { setTimeLeft(FOCUS_DURATIONS[mode]); setRunning(false) }}
          style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: '12px 20px', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14, color: t.muted, cursor: 'pointer' }}>
          Reset
        </button>
        <button
          onClick={() => setRunning(r => !r)}
          style={{ background: t.accent, border: 'none', borderRadius: 12, padding: '12px 36px', fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 16, color: t.accentFg, cursor: 'pointer', minWidth: 130 }}>
          {running ? 'Pause' : 'Start'}
        </button>
      </div>

      {/* Session counter */}
      <div style={{ ...mkCard(t, { display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', padding: '12px 24px', marginTop: 8 }) }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: t.muted }}>Completed sessions</span>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: 22, color: t.accent }}>{sessions}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: Math.min(sessions, 8) }).map((_, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: t.accent }} />
          ))}
        </div>
      </div>

      {/* Tips */}
      <div style={{ ...mkCard(t, { width: '100%', maxWidth: 400 }) }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: t.muted, lineHeight: 1.6 }}>
          <strong style={{ color: t.text }}>Pomodoro method:</strong> Work for 25 focused minutes, then take a 5-minute break. After 4 sessions, take a longer 15–30 minute break.
        </p>
      </div>

      <div style={{ height: 16 }} />
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [themeKey, setThemeKey] = useState<ThemeKey>('notebook')
  const [screen, setScreen] = useState<ScreenKey>('today')
  const [showPicker, setShowPicker] = useState(false)
  const t = THEMES[themeKey]

  useEffect(() => {
    const close = () => setShowPicker(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: '100%', fontFamily: 'Inter, sans-serif' }}
      onClick={() => setShowPicker(false)}>

      <BlobBg t={t} />
      <Sidebar t={t} screen={screen} onNav={setScreen} />

      <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }} className="md:ml-[220px]">
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }} className="md:pb-8">
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div onClick={e => e.stopPropagation()}>
              <Header t={t} screen={screen} theme={themeKey} onTheme={setThemeKey}
                showPicker={showPicker} onTogglePicker={() => setShowPicker(v => !v)} />
            </div>

            {screen === 'today' && <TodayScreen t={t} onNav={setScreen} />}
            {screen === 'timetable' && <TimetableScreen t={t} />}
            {screen === 'bunk' && <BunkScreen t={t} />}
            {screen === 'sgpa' && <SGPAScreen t={t} />}
            {screen === 'internals' && <InternalsScreen t={t} />}
            {screen === 'focus' && <FocusScreen t={t} />}
          </div>
        </div>
      </div>

      <BottomBar t={t} screen={screen} onNav={setScreen} />
    </div>
  )
}
