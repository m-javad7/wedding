"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapPin, Send, Heart, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import * as Tone from 'tone';

/* ============================================================
   اطلاعات مراسم — همین بخش را با اطلاعات واقعی خودتان جایگزین کنید
   ============================================================ */
const weddingInfo = {
  brideName: 'عارفه',
  brideFamily: 'مداح‌زاده',
  groomName: 'محمدجواد',
  groomFamily: 'دره‌زرشکی',
  monogram: 'MA',
  weddingDateTime: '2026-08-28T19:00:00',
  dayName: 'جمعه',
  jalaliDay: '۶',
  jalaliMonth: 'شهریور',
  jalaliYear: '۱۴۰۵',
  time: '۱۹:۰۰',
  venueName: 'تالار پذیرایی راه و ماه',
  address: 'یزد، صفائیه، میدان ریاضی، بلوار ابن سینا، هتل راه و ماه',
  mapLink: 'https://balad.ir/p/5sJhngNV76jR2a',
  telegramLink: 'https://t.me/m_javad77',
  rsvpTelegramLink: 'https://t.me/m_javad77',
  photoUrl: '',
  galleryPhotos: [],
};

/* پالت رنگی: کِرم، سبز برگی و طلایی */
const COLORS = {
  wine: '#5b6b4a',
  wineDark: '#3f4a34',
  wineLight: '#7c8f68',
  blush: '#eee7d6',
  gold: '#c9a24b',
  paper: '#fffcf6',
  ink: '#463f2e',
};

/* افکت متن ورقِ طلا برای اسم‌ها */
const GOLD_TEXT = {
  backgroundImage: 'linear-gradient(110deg, #9c7735 0%, #f3e0b0 22%, #c9a24b 45%, #f6e6bd 68%, #9c7735 100%)',
  backgroundSize: '250% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
  animation: 'shimmer 6s linear infinite',
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
      console.warn('audio unavailable', e);
    }
  }

  function pause() {
    try { Tone.Transport.pause(); } catch (e) {}
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

/* ---------------- botanical decoration ---------------- */
function FlowerCluster({ x, y, scale = 1 }) {
  const petals = Array.from({ length: 5 });
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {petals.map((_, i) => {
        const a = (i / 5) * 360;
        return (
          <ellipse key={i} cx={0} cy={-6} rx={4.2} ry={6.4} fill="#ffffff" stroke="#e7dcc4" strokeWidth="0.5"
            transform={`rotate(${a})`} opacity="0.96" />
        );
      })}
      <circle cx={0} cy={0} r={2.3} fill={COLORS.gold} opacity="0.85" />
    </g>
  );
}

function Wreath({ size = 260 }) {
  const center = size / 2;
  const leafRadius = size * 0.4;
  const goldRingRadius = size * 0.315;
  const photoRadius = size * 0.27;
  const leafCount = 30;
  const greens = ['#7ea36a', '#8fae7a', '#6f8f5c', '#b7c9a0'];

  const leaves = Array.from({ length: leafCount }).map((_, i) => {
    const angle = (i / leafCount) * 360;
    return {
      angle,
      color: greens[i % greens.length],
      scale: 0.8 + (i % 3) * 0.12,
      tilt: i % 2 === 0 ? 14 : -14,
    };
  });

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0" aria-hidden="true">
        {leaves.map((l, i) => (
          <g key={i} transform={`translate(${center}, ${center}) rotate(${l.angle})`}>
            <g transform={`translate(0, ${-leafRadius}) rotate(${l.tilt}) scale(${l.scale})`}>
              <ellipse cx="0" cy="0" rx="5.4" ry="12" fill={l.color} opacity="0.88" />
              <ellipse cx="-2" cy="3" rx="3.6" ry="8" fill={l.color} opacity="0.55" />
            </g>
          </g>
        ))}
        <FlowerCluster x={center - leafRadius * 0.62} y={center + leafRadius * 0.72} scale={1.05} />
        <FlowerCluster x={center + leafRadius * 0.7} y={center + leafRadius * 0.58} scale={0.85} />
        <circle cx={center} cy={center} r={goldRingRadius} fill="none" stroke={COLORS.gold} strokeWidth="1.6" opacity="0.85" />
        <circle cx={center} cy={center} r={goldRingRadius + 4} fill="none" stroke={COLORS.gold} strokeWidth="0.8" opacity="0.4" />
      </svg>

      <div className="absolute rounded-full overflow-hidden flex items-center justify-center"
        style={{
          top: center - photoRadius, left: center - photoRadius,
          width: photoRadius * 2, height: photoRadius * 2,
          background: weddingInfo.photoUrl ? 'transparent' : 'linear-gradient(160deg, #f6f4ec, #e9e4d3)',
          boxShadow: 'inset 0 0 0 1px rgba(201,162,75,0.25)',
        }}>
        {weddingInfo.photoUrl ? (
          <img src={weddingInfo.photoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <Heart size={26} style={{ color: COLORS.gold, opacity: 0.55 }} />
        )}
      </div>
    </div>
  );
}

function GarlandBorder({ flip }) {
  const width = 380;
  const height = 46;
  const clusters = 10;
  const greens = ['#8fae7a', '#6f8f5c', '#b7c9a0', '#7ea36a'];
  const items = Array.from({ length: clusters }).map((_, i) => {
    const x = (i / (clusters - 1)) * width;
    const wobble = Math.sin(i * 1.4) * 9 + 15;
    const y = flip ? height - wobble : wobble;
    return {
      x, y,
      color: greens[i % greens.length],
      scale: 0.65 + (i % 3) * 0.16,
      rotate: i % 2 === 0 ? 18 : -18,
    };
  });
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none"
      style={{ display: 'block' }} aria-hidden="true">
      {items.map((it, i) => (
        <g key={i} transform={`translate(${it.x}, ${it.y}) rotate(${it.rotate}) scale(${it.scale})`}>
          <ellipse cx="0" cy="0" rx="6.5" ry="14" fill={it.color} opacity="0.85" />
          <ellipse cx="-3" cy="4" rx="4.4" ry="9.5" fill={it.color} opacity="0.55" />
        </g>
      ))}
      {items.filter((_, i) => i % 3 === 0).map((it, i) => (
        <circle key={`f${i}`} cx={it.x} cy={flip ? it.y + 7 : it.y - 7} r="3.4" fill="#ffffff" stroke="#e7dcc4" strokeWidth="0.6" />
      ))}
    </svg>
  );
}

function CornerBracket({ position }) {
  const size = 16;
  const base = { position: 'absolute', width: size, height: size, borderColor: COLORS.gold, opacity: 0.85 };
  const byPos = {
    tl: { top: -7, left: -7, borderTop: '1.4px solid', borderLeft: '1.4px solid' },
    tr: { top: -7, right: -7, borderTop: '1.4px solid', borderRight: '1.4px solid' },
    bl: { bottom: -7, left: -7, borderBottom: '1.4px solid', borderLeft: '1.4px solid' },
    br: { bottom: -7, right: -7, borderBottom: '1.4px solid', borderRight: '1.4px solid' },
  };
  return <span aria-hidden="true" style={{ ...base, ...byPos[position], borderColor: COLORS.gold }} />;
}

function GoldSwashDivider() {
  return (
    <svg width="200" height="22" viewBox="0 0 200 22" className="mx-auto my-5" aria-hidden="true">
      <path d="M0 11 C 55 11, 78 3, 100 11 C 122 19, 145 11, 200 11" stroke={COLORS.gold} strokeWidth="1.1" fill="none" opacity="0.85" />
      <path d="M88 5 L112 17 M112 5 L88 17" stroke={COLORS.gold} strokeWidth="1.1" opacity="0.75" />
    </svg>
  );
}

/* ---------------- invitation UI ---------------- */
function CountdownBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-lg px-3 py-2.5 sm:px-4 sm:py-3.5 min-w-[58px] sm:min-w-[72px] text-center overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #ffffff, #f8f4e8)',
          border: `1px solid ${COLORS.gold}`,
          boxShadow: '0 8px 20px rgba(91,107,74,0.14), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}
      >
        <span className="absolute inset-x-0 top-0" style={{ height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)` }} />
        <span className="block text-xl sm:text-2xl font-bold tabular-nums tracking-wider" style={{ color: COLORS.wine }}>
          {toFa(pad2(value))}
        </span>
      </div>
      <span className="mt-2 text-[10px] sm:text-[11px] tracking-[0.15em]" style={{ color: COLORS.wineLight }}>{label}</span>
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
        background: 'radial-gradient(circle at 35% 30%, #f3e9d0, #d8b978 55%, #a97f3c 100%)',
        boxShadow: '0 0 0 1.5px rgba(255,253,246,0.6), 0 6px 14px rgba(76,55,20,0.35)',
        opacity: isOpen ? 0 : 1,
        transform: `translateX(-50%) scale(${isOpen ? 0.4 : 1})`,
        animation: phase === 'closed' ? 'sealPulse 2.6s ease-in-out infinite' : 'none',
      }}>
      <span style={{ color: '#fffdf6', fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>
        {weddingInfo.monogram.split('').join(' · ')}
      </span>
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
          style={{
            background: `linear-gradient(155deg, ${COLORS.wineLight}, ${COLORS.wineDark})`,
            boxShadow: '0 18px 40px rgba(30,36,20,0.35), inset 0 0 0 1.5px rgba(233,201,143,0.45)',
          }}>
          <div className="absolute inset-x-0 bottom-0"
            style={{
              height: '62%',
              background: `linear-gradient(160deg, ${COLORS.wineLight}, ${COLORS.wineDark})`,
              clipPath: 'polygon(0 100%, 100% 100%, 100% 15%, 50% 60%, 0 15%)',
            }} />
          <span aria-hidden="true" className="absolute inset-x-0 flex items-center justify-center select-none"
            style={{
              bottom: '10%', fontSize: 64, fontWeight: 800, letterSpacing: 6,
              fontFamily: 'Georgia, "Times New Roman", serif',
              color: 'rgba(255,253,246,0.18)',
              textShadow: '0 1px 0 rgba(0,0,0,0.15)',
            }}>
            {weddingInfo.monogram}
          </span>
          <span aria-hidden="true" className="absolute inset-0"
            style={{
              background: 'linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.16) 48%, transparent 62%)',
              mixBlendMode: 'overlay',
            }} />
          <svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40" className="absolute" style={{ bottom: 8, insetInlineEnd: 10, opacity: 0.55 }}>
            <path d="M4 36 C 6 24, 12 16, 22 12" stroke="#e9c98f" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <ellipse cx="14" cy="22" rx="3.4" ry="6.5" fill="#e9c98f" opacity="0.7" transform="rotate(-30 14 22)" />
            <ellipse cx="20" cy="14" rx="2.8" ry="5.4" fill="#e9c98f" opacity="0.6" transform="rotate(-15 20 14)" />
          </svg>
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
      <div className="relative rounded-[26px] p-[6px]" style={{ border: `1px solid ${COLORS.gold}`, opacity: 0.95 }}>
        <CornerBracket position="tl" />
        <CornerBracket position="tr" />
        <CornerBracket position="bl" />
        <CornerBracket position="br" />
        <div className="relative rounded-[20px] pb-9 sm:pb-11 text-center overflow-hidden"
          style={{
            background: COLORS.paper,
            boxShadow: '0 30px 70px rgba(60,60,40,0.22), 0 8px 20px rgba(60,60,40,0.10)',
            border: `1px solid ${COLORS.blush}`,
          }}>
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(120deg, rgba(201,162,75,0.05) 0px, rgba(201,162,75,0.05) 1px, transparent 1px, transparent 5px)',
          }} />

          <button onClick={onReset} aria-label="بازگشت به پاکت"
            className="absolute z-10 flex items-center justify-center rounded-full transition-transform hover:scale-110"
            style={{ top: 14, left: 14, width: 34, height: 34, color: COLORS.wine, opacity: 0.75 }}>
            <ArrowLeft size={20} />
          </button>

          <GarlandBorder />

          <div className="px-6 sm:px-8 -mt-2">
            <Wreath size={230} />

            <div className="mt-5 flex items-center justify-center gap-2">
              <span style={{ width: 16, height: 1, background: COLORS.gold, opacity: 0.6 }} />
              <span className="text-[11px] tracking-[0.3em] uppercase font-medium" style={{ color: COLORS.gold }}>دعوت‌نامه عروسی</span>
              <span style={{ width: 16, height: 1, background: COLORS.gold, opacity: 0.6 }} />
            </div>

            <div className="mt-3 flex items-center justify-center gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={GOLD_TEXT}>{weddingInfo.brideName}</span>
              <Heart size={16} style={{ color: COLORS.gold }} fill={COLORS.gold} />
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={GOLD_TEXT}>{weddingInfo.groomName}</span>
            </div>

            <GoldSwashDivider />

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
                className="mt-3 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all hover:scale-[1.03]"
                style={{ background: `linear-gradient(135deg, ${COLORS.wineLight}, ${COLORS.wine})`, color: '#fffdf6', boxShadow: '0 8px 18px rgba(91,107,74,0.28)' }}>
                <MapPin size={14} /> مشاهده مسیر در نقشه
              </a>
            </div>

            <a href={weddingInfo.telegramLink} target="_blank" rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide border transition-all hover:scale-[1.03] hover:bg-[#c9a24b] hover:text-white"
              style={{ borderColor: COLORS.gold, color: COLORS.wineDark, background: 'rgba(201,162,75,0.06)' }}>
              <Send size={13} /> کانال تلگرام مراسم
            </a>
          </div>

          <div className="mt-8">
            <GarlandBorder flip />
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
    gold: Math.random() > 0.55,
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
              : 'linear-gradient(135deg, #cfdcb9, #9fb686)',
            borderRadius: '0% 60% 60% 60%',
            opacity: 0.65,
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
  const [isOpen, setIsOpen] = useState(false);
  const music = useRomanticMusic();

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    music.start();
  };

  const handleReset = () => {
    music.pause();
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      music.pause();
    };
  }, [music]);

  return (
    <div dir="rtl" className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden"
      style={{
        fontFamily: "'Vazirmatn', Tahoma, sans-serif",
        background: `radial-gradient(circle at 25% 18%, #fffdf9 0%, #f7f4e9 32%, #eeead9 65%, #dee2c9 100%)`,
      }}>
      <style>{`
        @keyframes floatY { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes sealPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(201,162,75,0.35); } 50% { box-shadow: 0 0 0 9px rgba(201,162,75,0); } }
        @keyframes sparkleOut {
          0% { transform: translate(0,0) scale(0); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(1); opacity: 0; }
        }
        @keyframes blobFloat1 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(24px, -18px) scale(1.08); } }
        @keyframes blobFloat2 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-18px, 22px) scale(1.05); } }
        @keyframes breathe { 0%, 100% { opacity: 0.3; transform: translate(-50%,-50%) scale(1); } 50% { opacity: 0.5; transform: translate(-50%,-50%) scale(1.12); } }
        @keyframes petalFall {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.55; }
          100% { transform: translateY(112vh) translateX(var(--drift)) rotate(360deg); opacity: 0; }
        }
        @keyframes twinkle { 0%, 100% { opacity: 0.15; transform: scale(0.8); } 50% { opacity: 0.9; transform: scale(1.2); } }
        @keyframes shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 250% 50%; } }
      `}</style>

      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 45%, transparent 45%, rgba(74,84,58,0.10) 100%)' }} />

      <div aria-hidden="true" className="absolute rounded-full pointer-events-none"
        style={{
          width: 480, height: 480, top: '50%', left: '50%',
          background: 'radial-gradient(circle, rgba(233,201,143,0.32), transparent 70%)',
          filter: 'blur(20px)', animation: 'breathe 6s ease-in-out infinite',
        }} />

      <div aria-hidden="true" className="absolute rounded-full pointer-events-none"
        style={{ width: 260, height: 260, top: '6%', left: '4%', background: '#dfe6c9', opacity: 0.5, filter: 'blur(60px)', animation: 'blobFloat1 9s ease-in-out infinite' }} />
      <div aria-hidden="true" className="absolute rounded-full pointer-events-none"
        style={{ width: 220, height: 220, bottom: '8%', right: '6%', background: '#e9c98f', opacity: 0.28, filter: 'blur(70px)', animation: 'blobFloat2 11s ease-in-out infinite' }} />

      <Petals />
      <Twinkles />

      {isOpen && (
        <button onClick={music.toggleMute} aria-label="قطع یا وصل موسیقی"
          className="fixed z-50 flex items-center justify-center rounded-full transition-transform hover:scale-110"
          style={{ top: 16, left: 16, width: 40, height: 40, background: COLORS.paper, border: `1px solid ${COLORS.blush}`, boxShadow: '0 4px 12px rgba(74,84,58,0.18)', color: COLORS.wine }}>
          {music.muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
      )}

      <div className="relative z-10 w-full flex items-center justify-center" style={{ minHeight: 420 }}>
        {!isOpen ? (
          <Envelope phase="closed" onOpen={handleOpen} />
        ) : (
          <InvitationCard visible={true} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}