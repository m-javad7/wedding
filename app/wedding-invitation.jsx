import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapPin, Send, Heart, Volume2, VolumeX } from 'lucide-react';
import * as Tone from 'tone';

/* ============================================================
   اطلاعات مراسم — همین بخش را با اطلاعات واقعی خودتان جایگزین کنید
   ============================================================ */
const weddingInfo = {
  brideName: 'عارفه',
  groomName: 'محمدجواد',
  // تاریخ و ساعت دقیق شروع مراسم (میلادی، معادل ۶ شهریور ۱۴۰۵)
  weddingDateTime: '2026-08-28T19:30:00',
  dayName: 'جمعه',
  jalaliDay: '۶',
  jalaliMonth: 'شهریور',
  jalaliYear: '۱۴۰۵',
  time: '۱۹:۳۰',
  venueName: 'باغ تالار عروسی',
  address: 'آدرس کامل محل برگزاری مراسم را اینجا وارد کنید',
  mapLink: 'https://maps.google.com/',
  telegramLink: 'https://t.me/m_javad77',
};

const COLORS = {
  wine: '#6d1a3a',
  wineDark: '#4c1029',
  wineLight: '#8a2249',
  blush: '#f6e2e6',
  gold: '#c9a24b',
  paper: '#fdf8f4',
  ink: '#3d1522',
};

function toFa(input) {
  const map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/[0-9]/g, (d) => map[d]);
}

function pad2(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

function useCountdown(targetISO) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(target - now, 0);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isOver: target - now <= 0 };
}

/* ---------------- audio (procedural, royalty-free) ---------------- */
function useRomanticMusic() {
  const audioRef = useRef({ started: false });
  const [muted, setMuted] = useState(false);

  async function start() {
    try {
      if (!audioRef.current.started) {
        await Tone.start();
        const vol = new Tone.Volume(-14).toDestination();
        const verb = new Tone.Freeverb({ roomSize: 0.75, dampening: 3200, wet: 0.3 }).connect(vol);

        const lead = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine' },
          envelope: { attack: 0.5, decay: 0.4, sustain: 0.5, release: 1.6 },
        }).connect(verb);
        lead.volume.value = -6;

        const pad = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: { attack: 1.4, decay: 0.6, sustain: 0.8, release: 2.6 },
        }).connect(verb);
        pad.volume.value = -16;

        const melody = ['E4', 'G4', 'B4', 'D5', 'C5', 'B4', 'G4', 'A4'];
        const chords = [['C3', 'E3', 'G3'], ['A2', 'C3', 'E3'], ['F2', 'A2', 'C3'], ['G2', 'B2', 'D3']];
        let step = 0;

        const loop = new Tone.Loop((time) => {
          lead.triggerAttackRelease(melody[step % melody.length], '4n', time);
          if (step % 4 === 0) {
            pad.triggerAttackRelease(chords[(step / 4) % chords.length], '2n', time);
          }
          step += 1;
        }, '2n');

        Tone.Transport.bpm.value = 64;
        loop.start(0);
        Tone.Transport.start();

        audioRef.current = { started: true, lead, pad, loop, vol, verb };
      } else {
        Tone.Transport.start();
      }
    } catch (e) {
      // audio unavailable — fail silently, visuals still work
      console.warn('audio unavailable', e);
    }
  }

  function pause() {
    try {
      Tone.Transport.pause();
    } catch (e) {}
  }

  function toggleMute() {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current.vol) audioRef.current.vol.mute = next;
      return next;
    });
  }

  useEffect(() => {
    return () => {
      try {
        Tone.Transport.stop();
        const a = audioRef.current;
        if (a.loop) a.loop.dispose();
        if (a.lead) a.lead.dispose();
        if (a.pad) a.pad.dispose();
        if (a.verb) a.verb.dispose();
        if (a.vol) a.vol.dispose();
      } catch (e) {}
    };
  }, []);

  return { start, pause, muted, toggleMute };
}

/* ---------------- decorative bits ---------------- */
function CountdownBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-xl px-3 py-2 sm:px-4 sm:py-3 min-w-[58px] sm:min-w-[70px] text-center overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #ffffff, #f3e6ea)',
          border: `1px solid ${COLORS.blush}`,
          boxShadow: '0 6px 16px rgba(109,26,58,0.10)',
        }}
      >
        <span
          className="absolute inset-x-0 top-0"
          style={{ height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)` }}
        />
        <span className="block text-xl sm:text-2xl font-bold tabular-nums" style={{ color: COLORS.wine }}>
          {toFa(pad2(value))}
        </span>
      </div>
      <span className="mt-1.5 text-[11px] sm:text-xs" style={{ color: COLORS.wineLight }}>
        {label}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-2 my-4 select-none" aria-hidden="true">
      <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.gold})` }} />
      <span style={{ width: 6, height: 6, border: `1.4px solid ${COLORS.gold}`, transform: 'rotate(45deg)' }} />
      <span style={{ width: 32, height: 1, background: `linear-gradient(90deg, ${COLORS.gold}, transparent)` }} />
    </div>
  );
}

function CornerFlourish({ mirrored }) {
  return (
    <svg width="64" height="64" viewBox="0 0 70 70" fill="none" aria-hidden="true"
      style={{ transform: mirrored ? 'rotate(180deg)' : 'none' }}>
      <path d="M5 65 C 5 40, 20 25, 45 20 C 55 18, 60 10, 62 5" stroke={COLORS.gold} strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      <path d="M18 56 C 24 45, 34 40, 40 31" stroke={COLORS.gold} strokeWidth="1.1" strokeLinecap="round" opacity="0.4" />
      <circle cx="45" cy="20" r="2.6" fill={COLORS.gold} opacity="0.5" />
      <circle cx="29" cy="46" r="1.8" fill={COLORS.gold} opacity="0.4" />
    </svg>
  );
}

function Sparkles({ show }) {
  if (!show) return null;
  const points = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 44;
    return { dx: Math.cos(angle) * radius, dy: Math.sin(angle) * radius, delay: i * 35 };
  });
  return (
    <>
      {points.map((p, i) => (
        <span key={i} className="absolute rounded-full"
          style={{
            left: '50%', bottom: '-26px', width: 6, height: 6, marginLeft: -3,
            background: COLORS.gold,
            '--dx': `${p.dx}px`, '--dy': `${p.dy}px`,
            animation: `sparkleOut 650ms ease-out ${p.delay}ms forwards`,
          }} />
      ))}
    </>
  );
}

function WaxSeal({ phase }) {
  const isOpen = phase !== 'closed';
  return (
    <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full transition-all duration-500"
      style={{
        bottom: '-26px', width: 60, height: 60,
        background: 'radial-gradient(circle at 35% 30%, #e8b9c4, #c05a7a 55%, #8a2249 100%)',
        opacity: isOpen ? 0 : 1,
        transform: `translateX(-50%) scale(${isOpen ? 0.4 : 1})`,
        animation: phase === 'closed' ? 'sealPulse 2.6s ease-in-out infinite' : 'none',
      }}>
      <Heart size={20} color="#fdf0f2" fill="#fdf0f2" strokeWidth={1.5} />
      <Sparkles show={phase === 'opening'} />
    </div>
  );
}

function Envelope({ phase, onOpen }) {
  const isOpen = phase !== 'closed';
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700"
      style={{ opacity: phase === 'open' ? 0 : 1, pointerEvents: phase === 'open' ? 'none' : 'auto' }}>
      <button onClick={onOpen} aria-label="باز کردن پاکت دعوت‌نامه"
        className="relative outline-none transition-transform hover:scale-[1.02]"
        style={{
          width: 300, maxWidth: '82vw', height: 200, perspective: 1000,
          cursor: phase === 'closed' ? 'pointer' : 'default',
          animation: phase === 'closed' ? 'floatY 3.6s ease-in-out infinite' : 'none',
        }}>
        <div className="absolute inset-0 rounded-md overflow-hidden"
          style={{ background: `linear-gradient(155deg, ${COLORS.wineLight}, ${COLORS.wineDark})`, boxShadow: '0 18px 40px rgba(30,6,18,0.35)' }}>
          <div className="absolute inset-x-0 bottom-0"
            style={{
              height: '62%',
              background: `linear-gradient(160deg, ${COLORS.wineLight}, ${COLORS.wineDark})`,
              clipPath: 'polygon(0 100%, 100% 100%, 100% 15%, 50% 60%, 0 15%)',
            }} />
        </div>
        <div className="absolute inset-x-0 top-0 transition-transform ease-in-out"
          style={{
            height: '58%', transformOrigin: 'top center', transformStyle: 'preserve-3d',
            transitionDuration: '900ms',
            transform: isOpen ? 'rotateX(-150deg)' : 'rotateX(0deg)',
            background: `linear-gradient(200deg, ${COLORS.wineLight}, ${COLORS.wine})`,
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            zIndex: isOpen ? 1 : 3,
          }} />
        <WaxSeal phase={phase} />
      </button>
      <p className="mt-10 text-sm tracking-wide transition-opacity duration-500"
        style={{ color: COLORS.wineDark, opacity: isOpen ? 0 : 0.75 }}>
        برای باز کردن دعوت‌نامه، روی پاکت ضربه بزنید
      </p>
    </div>
  );
}

function InvitationCard({ visible, onReset }) {
  const { days, hours, minutes, seconds, isOver } = useCountdown(weddingInfo.weddingDateTime);
  const brideInitial = weddingInfo.brideName?.charAt(0) || '';
  const groomInitial = weddingInfo.groomName?.charAt(0) || '';

  return (
    <div className="relative w-full max-w-[420px] transition-all"
      style={{
        transitionDuration: '900ms',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: visible ? '250ms' : '0ms',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.86)',
        pointerEvents: visible ? 'auto' : 'none',
      }}>
      <div className="rounded-[26px] p-[6px]" style={{ border: `1px solid ${COLORS.gold}`, opacity: 0.9 }}>
        <div className="relative rounded-[20px] px-6 py-9 sm:px-8 sm:py-11 text-center overflow-hidden"
          style={{ background: COLORS.paper, boxShadow: '0 24px 60px rgba(60,15,30,0.28)', border: `1px solid ${COLORS.blush}` }}>
          <div className="absolute top-2 right-2"><CornerFlourish /></div>
          <div className="absolute bottom-2 left-2"><CornerFlourish mirrored /></div>

          <div className="relative">
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: COLORS.gold }}>دعوت‌نامه عروسی</span>

            <div className="mx-auto my-4 flex items-center justify-center rounded-full"
              style={{ width: 62, height: 62, border: `1.5px solid ${COLORS.gold}`, background: COLORS.paper, boxShadow: '0 4px 12px rgba(160,90,110,0.18)' }}>
              <span className="text-lg font-bold" style={{ color: COLORS.wine }}>{brideInitial}</span>
              <Heart size={9} style={{ margin: '0 5px', color: COLORS.gold }} fill={COLORS.gold} />
              <span className="text-lg font-bold" style={{ color: COLORS.wine }}>{groomInitial}</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: COLORS.wine }}>{weddingInfo.brideName}</span>
              <Heart size={18} style={{ color: COLORS.gold }} fill={COLORS.gold} />
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: COLORS.wine }}>{weddingInfo.groomName}</span>
            </div>

            <Divider />

            <p className="text-sm sm:text-base leading-8" style={{ color: COLORS.ink }}>
              از میان تمام روزهای زندگی، این یکی را
              <br />
              برای آغازی تازه انتخاب کرده‌ایم
              <br />
              دوست داریم این لحظه را کنار شما جشن بگیریم
            </p>

            <Divider />

            <div className="text-sm sm:text-base" style={{ color: COLORS.wineDark }}>
              <span className="font-semibold">{weddingInfo.dayName}</span>
              {' ، '}
              <span className="font-semibold">{weddingInfo.jalaliDay} {weddingInfo.jalaliMonth} {weddingInfo.jalaliYear}</span>
              {'  —  ساعت '}
              <span className="font-semibold">{toFa(weddingInfo.time)}</span>
            </div>

            <div className="mt-5 mb-1">
              {isOver ? (
                <p className="text-base font-semibold" style={{ color: COLORS.wine }}>مراسم آغاز شده است 🎉</p>
              ) : (
                <>
                  <p className="text-xs mb-2" style={{ color: COLORS.wineLight }}>تا شروع مراسم</p>
                  <div className="flex items-center justify-center gap-2 sm:gap-3" dir="ltr">
                    <CountdownBlock value={days} label="روز" />
                    <CountdownBlock value={hours} label="ساعت" />
                    <CountdownBlock value={minutes} label="دقیقه" />
                    <CountdownBlock value={seconds} label="ثانیه" />
                  </div>
                </>
              )}
            </div>

            <Divider />

            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-1.5" style={{ color: COLORS.wine }}>
                <MapPin size={16} />
                <span className="text-sm font-semibold">{weddingInfo.venueName}</span>
              </div>
              <p className="text-xs leading-6 max-w-[280px]" style={{ color: COLORS.ink, opacity: 0.85 }}>{weddingInfo.address}</p>
              <a href={weddingInfo.mapLink} target="_blank" rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-transform hover:scale-[1.03]"
                style={{ background: COLORS.wine, color: '#fdf0f2' }}>
                <MapPin size={14} /> مشاهده مسیر در نقشه
              </a>
            </div>

            <a href={weddingInfo.telegramLink} target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold border transition-transform hover:scale-[1.03]"
              style={{ borderColor: COLORS.gold, color: COLORS.wineDark }}>
              <Send size={13} /> کانال تلگرام مراسم
            </a>

            <div className="mt-6">
              <button onClick={onReset} className="text-[11px] underline-offset-2 hover:underline"
                style={{ color: COLORS.wineLight, opacity: 0.7 }}>
                بازگشت به پاکت
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- ambient background ---------------- */
function Petals() {
  const petals = useMemo(() => Array.from({ length: 14 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 8 + Math.random() * 9,
    duration: 11 + Math.random() * 9,
    delay: Math.random() * 12,
    drift: (Math.random() - 0.5) * 70,
    gold: Math.random() > 0.6,
  })), []);

  return (
    <>
      {petals.map((p) => (
        <span key={p.id} aria-hidden="true" className="absolute top-[-6%] pointer-events-none"
          style={{
            left: `${p.left}%`,
            width: p.size, height: p.size * 0.8,
            background: p.gold
              ? 'linear-gradient(135deg, #e7c98a, #c9a24b)'
              : 'linear-gradient(135deg, #f7d3dd, #e2a7bb)',
            borderRadius: '0% 60% 60% 60%',
            opacity: 0.7,
            '--drift': `${p.drift}px`,
            animation: `petalFall ${p.duration}s linear ${p.delay}s infinite`,
          }} />
      ))}
    </>
  );
}

function Twinkles() {
  const stars = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 2 + Math.random() * 2,
    delay: Math.random() * 4,
    duration: 2.6 + Math.random() * 2.6,
  })), []);

  return (
    <>
      {stars.map((s) => (
        <span key={s.id} aria-hidden="true" className="absolute rounded-full pointer-events-none"
          style={{
            top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size,
            background: COLORS.gold,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }} />
      ))}
    </>
  );
}

export default function WeddingInvitation() {
  const [phase, setPhase] = useState('closed'); // closed | opening | open
  const timerRef = useRef(null);
  const music = useRomanticMusic();

  const handleOpen = () => {
    if (phase !== 'closed') return;
    setPhase('opening');
    music.start();
    timerRef.current = setTimeout(() => setPhase('open'), 700);
  };

  const handleReset = () => {
    clearTimeout(timerRef.current);
    music.pause();
    setPhase('closed');
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div dir="rtl" className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden"
      style={{
        fontFamily: "'Vazirmatn', Tahoma, sans-serif",
        background: `radial-gradient(circle at 25% 18%, #fdeef2 0%, #f8d9e3 32%, #edc0d3 65%, #d9a2bf 100%)`,
      }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap');

        @keyframes floatY { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes sealPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(201,162,75,0.35); } 50% { box-shadow: 0 0 0 9px rgba(201,162,75,0); } }
        @keyframes sparkleOut {
          0% { transform: translate(0,0) scale(0); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(1); opacity: 0; }
        }
        @keyframes blobFloat1 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(24px, -18px) scale(1.08); } }
        @keyframes blobFloat2 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-18px, 22px) scale(1.05); } }
        @keyframes breathe { 0%, 100% { opacity: 0.35; transform: translate(-50%,-50%) scale(1); } 50% { opacity: 0.6; transform: translate(-50%,-50%) scale(1.12); } }
        @keyframes petalFall {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.75; }
          90% { opacity: 0.6; }
          100% { transform: translateY(112vh) translateX(var(--drift)) rotate(360deg); opacity: 0; }
        }
        @keyframes twinkle { 0%, 100% { opacity: 0.15; transform: scale(0.8); } 50% { opacity: 0.9; transform: scale(1.2); } }
      `}</style>

      {/* soft romantic vignette */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 45%, transparent 45%, rgba(76,16,41,0.16) 100%)' }} />

      {/* breathing glow behind everything */}
      <div aria-hidden="true" className="absolute rounded-full pointer-events-none"
        style={{
          width: 480, height: 480, top: '50%', left: '50%',
          background: 'radial-gradient(circle, rgba(233,201,143,0.35), transparent 70%)',
          filter: 'blur(20px)', animation: 'breathe 6s ease-in-out infinite',
        }} />

      {/* ambient bokeh blobs */}
      <div aria-hidden="true" className="absolute rounded-full pointer-events-none"
        style={{ width: 260, height: 260, top: '6%', left: '4%', background: COLORS.blush, opacity: 0.55, filter: 'blur(60px)', animation: 'blobFloat1 9s ease-in-out infinite' }} />
      <div aria-hidden="true" className="absolute rounded-full pointer-events-none"
        style={{ width: 220, height: 220, bottom: '8%', right: '6%', background: '#e9c98f', opacity: 0.28, filter: 'blur(70px)', animation: 'blobFloat2 11s ease-in-out infinite' }} />

      <Petals />
      <Twinkles />

      {music.muted !== undefined && phase === 'open' && (
        <button onClick={music.toggleMute} aria-label="قطع یا وصل موسیقی"
          className="fixed z-50 flex items-center justify-center rounded-full transition-transform hover:scale-110"
          style={{ top: 16, left: 16, width: 40, height: 40, background: COLORS.paper, border: `1px solid ${COLORS.blush}`, boxShadow: '0 4px 12px rgba(76,16,41,0.18)', color: COLORS.wine }}>
          {music.muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
      )}

      <div className="relative z-10 w-full flex items-center justify-center" style={{ minHeight: 420 }}>
        <Envelope phase={phase} onOpen={handleOpen} />
        <InvitationCard visible={phase === 'open'} onReset={handleReset} />
      </div>
    </div>
  );
}