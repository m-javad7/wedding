"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapPin, Send, Heart, Volume2, VolumeX, ArrowLeft, Sparkles as SparklesIcon } from 'lucide-react';
import * as Tone from 'tone';

/* ============================================================
   اطلاعات مراسم - با اطلاعات واقعی جایگزین کنید
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

/* پالت رنگی لوکس */
const COLORS = {
  wine: '#5b6b4a',
  wineDark: '#3f4a34',
  wineLight: '#7c8f68',
  blush: '#f5efe6',
  gold: '#c9a24b',
  goldLight: '#e8d5a3',
  paper: '#fdfbf7',
  ink: '#3d3526',
  rose: '#e8c9c9',
  cream: '#faf6ed',
};

/* افکت طلایی برای اسم‌ها */
const GOLD_TEXT = {
  background: 'linear-gradient(135deg, #c9a24b 0%, #f6e6bd 25%, #c9a24b 50%, #f6e6bd 75%, #c9a24b 100%)',
  backgroundSize: '300% 300%',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
  animation: 'goldShimmer 4s ease-in-out infinite',
  filter: 'drop-shadow(0 2px 4px rgba(201,162,75,0.3))',
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

/* موسیقی پس‌زمینه */
function useRomanticMusic() {
  const audioRef = useRef({ started: false });
  const [muted, setMuted] = useState(false);

  async function start() {
    try {
      if (!audioRef.current.started) {
        await Tone.start();
        const vol = new Tone.Volume(-12).toDestination();
        const verb = new Tone.Freeverb({ roomSize: 0.8, dampening: 3000, wet: 0.35 }).connect(vol);

        const lead = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine' },
          envelope: { attack: 0.4, decay: 0.3, sustain: 0.6, release: 1.8 },
        }).connect(verb);
        lead.volume.value = -5;

        const pad = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: { attack: 1.6, decay: 0.5, sustain: 0.9, release: 3.0 },
        }).connect(verb);
        pad.volume.value = -15;

        const melody = ['E4', 'G4', 'B4', 'D5', 'C5', 'B4', 'G4', 'A4', 'F#4', 'G4'];
        const chords = [['C3', 'E3', 'G3'], ['A2', 'C3', 'E3'], ['F2', 'A2', 'C3'], ['G2', 'B2', 'D3'], ['E2', 'G2', 'B2']];
        let step = 0;

        const loop = new Tone.Loop((time) => {
          lead.triggerAttackRelease(melody[step % melody.length], '4n', time);
          if (step % 4 === 0) {
            pad.triggerAttackRelease(chords[(step / 4) % chords.length], '2n', time);
          }
          step += 1;
        }, '2n');

        Tone.Transport.bpm.value = 68;
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

/* اجزای تزئینی */
function FlowerCluster({ x, y, scale = 1, color = '#ffffff' }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * 360;
        return (
          <ellipse key={i} cx={0} cy={-7} rx={4.5} ry={7} fill={color} stroke="#e7dcc4" strokeWidth="0.5"
            transform={`rotate(${a})`} opacity="0.95" />
        );
      })}
      <circle cx={0} cy={0} r={2.8} fill={COLORS.gold} opacity="0.9">
        <animate attributeName="r" values="2.8;3.5;2.8" dur="2s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

function Wreath({ size = 280 }) {
  const center = size / 2;
  const leafRadius = size * 0.4;
  const goldRingRadius = size * 0.32;
  const photoRadius = size * 0.28;
  const leafCount = 36;
  const greens = ['#7ea36a', '#8fae7a', '#6f8f5c', '#b7c9a0', '#9ab884', '#a8c492'];

  const leaves = Array.from({ length: leafCount }).map((_, i) => ({
    angle: (i / leafCount) * 360,
    color: greens[i % greens.length],
    scale: 0.75 + (i % 3) * 0.15,
    tilt: i % 2 === 0 ? 15 : -15,
  }));

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0" aria-hidden="true">
        <defs>
          <radialGradient id="leafGrad">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {leaves.map((l, i) => (
          <g key={i} transform={`translate(${center}, ${center}) rotate(${l.angle})`}>
            <g transform={`translate(0, ${-leafRadius}) rotate(${l.tilt}) scale(${l.scale})`}>
              <ellipse cx="0" cy="0" rx="6" ry="13" fill={l.color} opacity="0.9">
                <animate attributeName="opacity" values="0.85;0.95;0.85" dur={`${3 + i % 2}s`} repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="-2" cy="3" rx="4" ry="9" fill={l.color} opacity="0.5" />
              <ellipse cx="0" cy="0" rx="6" ry="13" fill="url(#leafGrad)" opacity="0.3" />
            </g>
          </g>
        ))}
        <FlowerCluster x={center - leafRadius * 0.65} y={center + leafRadius * 0.75} scale={1.1} color="#fefefe" />
        <FlowerCluster x={center + leafRadius * 0.72} y={center + leafRadius * 0.6} scale={0.9} color="#f8f4ed" />
        <FlowerCluster x={center - leafRadius * 0.3} y={center - leafRadius * 0.55} scale={0.8} color="#faf6ef" />
        
        <circle cx={center} cy={center} r={goldRingRadius} fill="none" stroke={COLORS.gold} strokeWidth="2" opacity="0.8">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx={center} cy={center} r={goldRingRadius + 5} fill="none" stroke={COLORS.gold} strokeWidth="0.8" opacity="0.3" />
        <circle cx={center} cy={center} r={goldRingRadius - 3} fill="none" stroke={COLORS.goldLight} strokeWidth="0.5" opacity="0.2" />
      </svg>

      <div className="absolute rounded-full overflow-hidden flex items-center justify-center"
        style={{
          top: center - photoRadius, left: center - photoRadius,
          width: photoRadius * 2, height: photoRadius * 2,
          background: weddingInfo.photoUrl ? 'transparent' : 'radial-gradient(circle at 30% 30%, #f8f4ec, #e9e4d3)',
          boxShadow: '0 0 0 3px rgba(201,162,75,0.2), 0 8px 30px rgba(91,107,74,0.15)',
          border: '2px solid rgba(201,162,75,0.3)',
        }}>
        {weddingInfo.photoUrl ? (
          <img src={weddingInfo.photoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center">
            <Heart size={32} style={{ color: COLORS.gold, opacity: 0.6 }} fill="rgba(201,162,75,0.2)" />
            <span className="text-xs mt-1" style={{ color: COLORS.gold, opacity: 0.4 }}>عکس شما</span>
          </div>
        )}
      </div>
    </div>
  );
}

function GarlandBorder({ flip }) {
  const width = 400;
  const height = 50;
  const clusters = 12;
  const greens = ['#8fae7a', '#6f8f5c', '#b7c9a0', '#7ea36a', '#9ab884', '#a8c492'];
  const items = Array.from({ length: clusters }).map((_, i) => {
    const x = (i / (clusters - 1)) * width;
    const wobble = Math.sin(i * 1.3 + 0.5) * 10 + 18;
    const y = flip ? height - wobble : wobble;
    return { x, y, color: greens[i % greens.length], scale: 0.7 + (i % 3) * 0.15, rotate: i % 2 === 0 ? 20 : -20 };
  });
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none"
      style={{ display: 'block' }} aria-hidden="true">
      {items.map((it, i) => (
        <g key={i} transform={`translate(${it.x}, ${it.y}) rotate(${it.rotate}) scale(${it.scale})`}>
          <ellipse cx="0" cy="0" rx="7" ry="15" fill={it.color} opacity="0.85" />
          <ellipse cx="-3" cy="4" rx="4.5" ry="10" fill={it.color} opacity="0.5" />
        </g>
      ))}
      {items.filter((_, i) => i % 2 === 0).map((it, i) => (
        <g key={`f${i}`} transform={`translate(${it.x}, ${flip ? it.y + 8 : it.y - 8})`}>
          <circle cx="0" cy="0" r="4" fill="#ffffff" stroke="#e7dcc4" strokeWidth="0.7" />
          <circle cx="0" cy="0" r="1.5" fill={COLORS.gold} opacity="0.6" />
        </g>
      ))}
    </svg>
  );
}

function CornerBracket({ position }) {
  const size = 20;
  const base = { position: 'absolute', width: size, height: size, borderColor: COLORS.gold, opacity: 0.7 };
  const byPos = {
    tl: { top: -8, left: -8, borderTop: '2px solid', borderLeft: '2px solid' },
    tr: { top: -8, right: -8, borderTop: '2px solid', borderRight: '2px solid' },
    bl: { bottom: -8, left: -8, borderBottom: '2px solid', borderLeft: '2px solid' },
    br: { bottom: -8, right: -8, borderBottom: '2px solid', borderRight: '2px solid' },
  };
  return <span aria-hidden="true" style={{ ...base, ...byPos[position], borderColor: COLORS.gold }} />;
}

function GoldSwashDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-4">
      <svg width="80" height="20" viewBox="0 0 80 20" aria-hidden="true">
        <path d="M0 10 C 20 10, 30 2, 40 10 C 50 18, 60 10, 80 10" stroke={COLORS.gold} strokeWidth="1.2" fill="none" opacity="0.7" />
      </svg>
      <span style={{ color: COLORS.gold, fontSize: 14 }}>✦</span>
      <svg width="80" height="20" viewBox="0 0 80 20" aria-hidden="true">
        <path d="M0 10 C 20 10, 30 18, 40 10 C 50 2, 60 10, 80 10" stroke={COLORS.gold} strokeWidth="1.2" fill="none" opacity="0.7" />
      </svg>
    </div>
  );
}

function CountdownBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative rounded-xl px-4 py-3 min-w-[65px] sm:min-w-[78px] text-center overflow-hidden
        backdrop-blur-sm transition-all hover:scale-105"
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.95), rgba(248,244,232,0.9))',
          border: `1.5px solid ${COLORS.gold}`,
          boxShadow: '0 8px 25px rgba(91,107,74,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}>
        <span className="absolute inset-x-0 top-0" style={{ height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)` }} />
        <span className="block text-2xl sm:text-3xl font-bold tabular-nums tracking-wider" style={{ color: COLORS.wine }}>
          {toFa(pad2(value))}
        </span>
      </div>
      <span className="mt-2 text-[10px] sm:text-xs tracking-[0.2em] font-medium" style={{ color: COLORS.wineLight }}>{label}</span>
    </div>
  );
}

function Sparkles({ show }) {
  if (!show) return null;
  const points = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const radius = 50 + Math.random() * 20;
    return { dx: Math.cos(angle) * radius, dy: Math.sin(angle) * radius, delay: i * 30 + Math.random() * 20 };
  });
  return (
    <>
      {points.map((p, i) => (
        <span key={i} className="absolute rounded-full"
          style={{
            left: '50%', bottom: '-30px', width: 6, height: 6, marginLeft: -3,
            background: COLORS.gold,
            '--dx': `${p.dx}px`, '--dy': `${p.dy}px`,
            animation: `sparkleOut 700ms ease-out ${p.delay}ms forwards`,
            boxShadow: `0 0 10px ${COLORS.gold}`,
          }} />
      ))}
    </>
  );
}

function WaxSeal({ phase }) {
  const isOpen = phase !== 'closed';
  return (
    <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full transition-all duration-700"
      style={{
        bottom: '-30px', width: 65, height: 65,
        background: 'radial-gradient(circle at 35% 30%, #f3e9d0, #d8b978 50%, #b8923a 100%)',
        boxShadow: '0 0 0 2px rgba(255,253,246,0.6), 0 8px 20px rgba(76,55,20,0.4), inset 0 -2px 4px rgba(0,0,0,0.1)',
        opacity: isOpen ? 0 : 1,
        transform: `translateX(-50%) scale(${isOpen ? 0.3 : 1}) rotate(${isOpen ? 180 : 0}deg)`,
        animation: phase === 'closed' ? 'sealPulse 2.8s ease-in-out infinite' : 'none',
      }}>
      <span style={{ color: '#fffdf6', fontSize: 17, fontWeight: 700, letterSpacing: 3, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
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
        className="relative outline-none transition-all duration-300 hover:scale-[1.03] group"
        style={{
          width: 320, maxWidth: '85vw', height: 210, perspective: 1200,
          cursor: phase === 'closed' ? 'pointer' : 'default',
          animation: phase === 'closed' ? 'floatY 3.6s ease-in-out infinite' : 'none',
        }}>
        <div className="absolute inset-0 rounded-lg overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${COLORS.wineLight}, ${COLORS.wineDark})`,
            boxShadow: '0 20px 50px rgba(30,36,20,0.4), inset 0 0 0 2px rgba(233,201,143,0.4)',
          }}>
          <div className="absolute inset-x-0 bottom-0"
            style={{
              height: '60%',
              background: `linear-gradient(160deg, ${COLORS.wineLight}, ${COLORS.wineDark})`,
              clipPath: 'polygon(0 100%, 100% 100%, 100% 15%, 50% 55%, 0 15%)',
            }} />
          
          {/* الگوی تزئینی روی پاکت */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
          
          <span aria-hidden="true" className="absolute inset-x-0 flex items-center justify-center select-none"
            style={{
              bottom: '12%', fontSize: 72, fontWeight: 800, letterSpacing: 8,
              fontFamily: 'Georgia, "Times New Roman", serif',
              color: 'rgba(255,253,246,0.12)',
              textShadow: '0 2px 0 rgba(0,0,0,0.1)',
            }}>
            {weddingInfo.monogram}
          </span>
          
          <span aria-hidden="true" className="absolute inset-0"
            style={{
              background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.2) 45%, transparent 60%)',
              mixBlendMode: 'overlay',
            }} />
          
          <svg aria-hidden="true" width="50" height="50" viewBox="0 0 50 50" className="absolute" style={{ bottom: 8, insetInlineEnd: 12, opacity: 0.4 }}>
            <path d="M5 42 C 8 28, 15 18, 28 12" stroke="#e9c98f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <ellipse cx="18" cy="26" rx="4" ry="8" fill="#e9c98f" opacity="0.6" transform="rotate(-30 18 26)" />
            <ellipse cx="25" cy="16" rx="3.5" ry="6.5" fill="#e9c98f" opacity="0.5" transform="rotate(-15 25 16)" />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-xs tracking-widest bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
              ✦ باز کردن ✦
            </span>
          </div>
        </div>
        
        <div className="absolute inset-x-0 top-0 transition-all duration-700 ease-out"
          style={{
            height: '56%', transformOrigin: 'top center', transformStyle: 'preserve-3d',
            transform: isOpen ? 'rotateX(-160deg)' : 'rotateX(0deg)',
            background: `linear-gradient(200deg, ${COLORS.wineLight}, ${COLORS.wine})`,
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            zIndex: isOpen ? 1 : 3,
            boxShadow: isOpen ? '0 10px 30px rgba(0,0,0,0.2)' : 'none',
          }}>
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
          }} />
        </div>
        
        <WaxSeal phase={phase} />
      </button>
      
      <p className="mt-12 text-sm tracking-wider transition-all duration-500"
        style={{ 
          color: COLORS.wineDark, 
          opacity: isOpen ? 0 : 0.8,
          textShadow: '0 1px 2px rgba(255,255,255,0.5)',
        }}>
        ✦ برای باز کردن، روی پاکت ضربه بزنید ✦
      </p>
    </div>
  );
}

function InvitationCard({ visible, onReset }) {
  const { days, hours, minutes, seconds, isOver } = useCountdown(weddingInfo.weddingDateTime);

  return (
    <div className="relative w-full max-w-[440px] transition-all duration-1000"
      style={{
        transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        transitionDelay: visible ? '300ms' : '0ms',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.85)',
        pointerEvents: visible ? 'auto' : 'none',
      }}>
      <div className="relative rounded-[28px] p-[8px]" style={{ 
        border: `1.5px solid ${COLORS.gold}`,
        background: `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.gold})`,
        boxShadow: '0 30px 80px rgba(60,60,40,0.25)',
      }}>
        <CornerBracket position="tl" />
        <CornerBracket position="tr" />
        <CornerBracket position="bl" />
        <CornerBracket position="br" />
        
        <div className="relative rounded-[20px] pb-10 sm:pb-12 text-center overflow-hidden"
          style={{
            background: COLORS.paper,
            boxShadow: 'inset 0 2px 20px rgba(201,162,75,0.08)',
          }}>
          {/* بافت پس‌زمینه */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-30" style={{
            backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(201,162,75,0.05) 0%, transparent 50%)',
          }} />
          
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(201,162,75,0.03) 0px, rgba(201,162,75,0.03) 2px, transparent 2px, transparent 8px)',
          }} />

          <button onClick={onReset} aria-label="بازگشت به پاکت"
            className="absolute z-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
            style={{ top: 16, left: 16, width: 36, height: 36, color: COLORS.wine, opacity: 0.7, background: 'rgba(255,255,255,0.8)' }}>
            <ArrowLeft size={18} />
          </button>

          <GarlandBorder />

          <div className="px-6 sm:px-8 -mt-2">
            <Wreath size={250} />

            <div className="mt-4 flex items-center justify-center gap-3">
              <span style={{ width: 20, height: 1.5, background: `linear-gradient(90deg, transparent, ${COLORS.gold})` }} />
              <span className="text-[10px] tracking-[0.4em] uppercase font-medium" style={{ color: COLORS.gold }}>دعوت‌نامه</span>
              <span style={{ width: 20, height: 1.5, background: `linear-gradient(90deg, ${COLORS.gold}, transparent)` }} />
            </div>

            <div className="mt-4 flex items-center justify-center gap-4">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight" style={GOLD_TEXT}>{weddingInfo.brideName}</span>
              <div className="relative">
                <Heart size={20} style={{ color: COLORS.gold }} fill={COLORS.gold} />
                <Heart size={14} style={{ color: COLORS.goldLight, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
              </div>
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight" style={GOLD_TEXT}>{weddingInfo.groomName}</span>
            </div>

            <GoldSwashDivider />

            <div className="space-y-2">
              <p className="text-sm sm:text-base leading-8" style={{ color: COLORS.ink }}>
                از میان تمام روزهای زندگی، این یکی را
                <br />
                برای آغازی تازه انتخاب کرده‌ایم
              </p>
              <p className="text-sm sm:text-base leading-8 font-light" style={{ color: COLORS.wineLight }}>
                دوست داریم این لحظه را کنار شما جشن بگیریم
              </p>
            </div>

            <div className="my-4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${COLORS.goldLight}, transparent)` }} />

            <div className="text-sm sm:text-base" style={{ color: COLORS.wineDark }}>
              <span className="font-bold" style={{ color: COLORS.gold }}>{weddingInfo.dayName}</span>
              {' ، '}
              <span className="font-bold">{weddingInfo.jalaliDay} {weddingInfo.jalaliMonth} {weddingInfo.jalaliYear}</span>
              {'  —  ساعت '}
              <span className="font-bold" style={{ color: COLORS.gold }}>{toFa(weddingInfo.time)}</span>
            </div>

            <div className="mt-6 mb-2">
              {isOver ? (
                <p className="text-base font-bold" style={{ color: COLORS.wine }}>🎉 مراسم آغاز شده است 🎉</p>
              ) : (
                <>
                  <p className="text-xs mb-3 tracking-wider" style={{ color: COLORS.wineLight }}>⏳ زمان باقی‌مانده تا شروع</p>
                  <div className="flex items-center justify-center gap-2 sm:gap-3" dir="ltr">
                    <CountdownBlock value={days} label="روز" />
                    <CountdownBlock value={hours} label="ساعت" />
                    <CountdownBlock value={minutes} label="دقیقه" />
                    <CountdownBlock value={seconds} label="ثانیه" />
                  </div>
                </>
              )}
            </div>

            <div className="my-4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${COLORS.goldLight}, transparent)` }} />

            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2" style={{ color: COLORS.wine }}>
                <MapPin size={17} strokeWidth={1.8} />
                <span className="text-sm font-bold">{weddingInfo.venueName}</span>
              </div>
              <p className="text-xs leading-6 max-w-[280px]" style={{ color: COLORS.ink, opacity: 0.7 }}>{weddingInfo.address}</p>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-3">
                <a href={weddingInfo.mapLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.wineLight}, ${COLORS.wine})`,
                    color: '#fffdf6',
                    boxShadow: '0 8px 20px rgba(91,107,74,0.3)',
                  }}>
                  <MapPin size={14} /> مشاهده مسیر
                </a>
                
                <a href={weddingInfo.telegramLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{
                    border: `1.5px solid ${COLORS.gold}`,
                    color: COLORS.wineDark,
                    background: 'rgba(201,162,75,0.08)',
                  }}>
                  <Send size={13} /> کانال تلگرام
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <GarlandBorder flip />
          </div>
          
          {/* نشان تزیینی پایین */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-30">
            <span className="text-[8px] tracking-[0.3em]" style={{ color: COLORS.gold }}>✦ ✦ ✦</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* پس‌زمینه با گلبرگ‌های متحرک */
function Petals() {
  const petals = useMemo(() => Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 7 + Math.random() * 10,
    duration: 12 + Math.random() * 10,
    delay: Math.random() * 14,
    drift: (Math.random() - 0.5) * 80,
    gold: Math.random() > 0.5,
    rotation: Math.random() * 360,
  })), []);

  return (
    <>
      {petals.map((p) => (
        <span key={p.id} aria-hidden="true" className="absolute top-[-8%] pointer-events-none"
          style={{
            left: `${p.left}%`,
            width: p.size, height: p.size * 0.7,
            background: p.gold
              ? `radial-gradient(circle at 30% 30%, #f0e0b8, ${COLORS.gold})`
              : `radial-gradient(circle at 30% 30%, #d8e8c8, #8fae7a)`,
            borderRadius: '0% 60% 60% 60%',
            opacity: 0.5,
            transform: `rotate(${p.rotation}deg)`,
            '--drift': `${p.drift}px`,
            animation: `petalFall ${p.duration}s linear ${p.delay}s infinite`,
            filter: 'blur(0.5px)',
          }} />
      ))}
    </>
  );
}

function Twinkles() {
  const stars = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 1.5 + Math.random() * 2.5,
    delay: Math.random() * 5,
    duration: 2.5 + Math.random() * 3,
    color: Math.random() > 0.5 ? COLORS.gold : COLORS.goldLight,
  })), []);

  return (
    <>
      {stars.map((s) => (
        <span key={s.id} aria-hidden="true" className="absolute rounded-full pointer-events-none"
          style={{
            top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size,
            background: s.color,
            boxShadow: `0 0 6px ${s.color}`,
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
        fontFamily: "'Vazirmatn', 'Tahoma', sans-serif",
        background: `
          radial-gradient(ellipse at 30% 20%, #fffdf9 0%, #f8f4e9 25%, #f0ebda 50%, #e6e4d4 75%, #dde2c9 100%)
        `,
      }}>
      <style>{`
        @keyframes floatY { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-10px); } 
        }
        
        @keyframes sealPulse { 
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,162,75,0.4); } 
          50% { box-shadow: 0 0 0 12px rgba(201,162,75,0); } 
        }
        
        @keyframes sparkleOut {
          0% { transform: translate(0,0) scale(0); opacity: 0; }
          30% { opacity: 1; transform: translate(calc(var(--dx)*0.3), calc(var(--dy)*0.3)) scale(0.8); }
          100% { transform: translate(var(--dx), var(--dy)) scale(1.2); opacity: 0; }
        }
        
        @keyframes blobFloat1 { 
          0%, 100% { transform: translate(0,0) scale(1); } 
          50% { transform: translate(30px, -20px) scale(1.1); } 
        }
        
        @keyframes blobFloat2 { 
          0%, 100% { transform: translate(0,0) scale(1); } 
          50% { transform: translate(-20px, 25px) scale(1.08); } 
        }
        
        @keyframes breathe { 
          0%, 100% { opacity: 0.25; transform: translate(-50%,-50%) scale(1); } 
          50% { opacity: 0.5; transform: translate(-50%,-50%) scale(1.15); } 
        }
        
        @keyframes petalFall {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.4; }
          100% { transform: translateY(112vh) translateX(var(--drift)) rotate(720deg); opacity: 0; }
        }
        
        @keyframes twinkle { 
          0%, 100% { opacity: 0.1; transform: scale(0.6); } 
          50% { opacity: 0.9; transform: scale(1.3); } 
        }
        
        @keyframes goldShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      {/* لایه‌های پس‌زمینه */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 40%, transparent 40%, rgba(74,84,58,0.06) 100%)' }} />

      <div aria-hidden="true" className="absolute rounded-full pointer-events-none"
        style={{
          width: 550, height: 550, top: '50%', left: '50%',
          background: 'radial-gradient(circle, rgba(233,201,143,0.25), transparent 65%)',
          filter: 'blur(30px)',
          animation: 'breathe 7s ease-in-out infinite',
        }} />

      <div aria-hidden="true" className="absolute rounded-full pointer-events-none"
        style={{
          width: 300, height: 300, top: '5%', left: '3%',
          background: 'radial-gradient(circle, #dfe6c9, transparent 70%)',
          opacity: 0.4,
          filter: 'blur(60px)',
          animation: 'blobFloat1 10s ease-in-out infinite',
        }} />
        
      <div aria-hidden="true" className="absolute rounded-full pointer-events-none"
        style={{
          width: 250, height: 250, bottom: '6%', right: '4%',
          background: 'radial-gradient(circle, #f0e0b8, transparent 70%)',
          opacity: 0.3,
          filter: 'blur(70px)',
          animation: 'blobFloat2 12s ease-in-out infinite',
        }} />

      <Petals />
      <Twinkles />

      {/* دکمه کنترل موسیقی */}
      {isOpen && (
        <button onClick={music.toggleMute} aria-label="قطع یا وصل موسیقی"
          className="fixed z-50 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
          style={{
            top: 16,
            left: 16,
            width: 44,
            height: 44,
            background: 'rgba(255,255,255,0.9)',
            border: `1.5px solid ${COLORS.goldLight}`,
            boxShadow: '0 4px 15px rgba(74,84,58,0.15)',
            color: COLORS.wine,
            backdropFilter: 'blur(10px)',
          }}>
          {music.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      <div className="relative z-10 w-full flex items-center justify-center" style={{ minHeight: 440 }}>
        {!isOpen ? (
          <Envelope phase="closed" onOpen={handleOpen} />
        ) : (
          <InvitationCard visible={true} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}