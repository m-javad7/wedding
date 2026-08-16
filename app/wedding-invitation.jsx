"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { MapPin, Send, Heart, Volume2, VolumeX, ArrowLeft, Navigation, MessageCircle, Share2, Phone, Sparkles as SparklesIcon, X, ChevronRight, ChevronLeft, ShieldCheck, CheckCircle, AlertCircle, User, Users } from 'lucide-react';

/* ============================================================
   اطلاعات مراسم
   ============================================================ */
const weddingInfo = {
  weddingDateTime: '2026-08-28T19:30:00',
  weddingDurationHours: 4,
  ceremonyLocationName: 'تالار مراسم',
  mapLink: 'https://maps.app.goo.gl/CLgomy6ba8KGDDq29',
  baladLink: 'https://balad.ir/p/5sJhngNV76jR2a',
  telegramLink: 'https://t.me/m_javad77',
  itaUsername: 'm_javad7721',
  whatsappNumber: '989162149083',
  smsNumber: '09162149083',
  galleryPhotos: ['/images/a.webp', '/images/b.webp', '/images/c.webp'],
  musicFile: '/a.mp3',
  paperSoundFile: '/paper.mp3',
  eitaaChatId: '11221180',
  baleBotUsername: 'your_bale_bot_username',
  messagesFile: '/messages.json',
};

/* ============================================================
   پالت رنگی
   ============================================================ */
const COLORS = {
  envelopeGreen: '#839678',
  envelopeGreenDark: '#6b7d61',
  envelopeGreenLight: '#9ab08e',
  sage: '#98a98d',
  sageDark: '#56664d',
  sageLight: '#c2cdbb',
  moss: '#717e65',
  paper: '#fcfbf7',
  linen: '#f4f0e6',
  bone: '#e8e2d5',
  ink: '#2d2926',
  gold: '#c9a24b',
  goldMatte: '#b59410',
  goldLight: '#f3e0b0',
  stringGold: '#d8b863'
};

const GOLD_TEXT = {
  backgroundImage: `linear-gradient(110deg, #9c7735 0%, ${COLORS.goldLight} 22%, ${COLORS.gold} 45%, #ffdb81 68%, #9c7735 100%)`,
  backgroundSize: '250% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
  animation: 'shimmer 6s linear infinite',
};

const INVITE_IMAGE_URL = '/images/v.webp';

/* ============================================================
   توابع کمکی
   ============================================================ */
const toFa = (input) => {
  const map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/[0-9]/g, (d) => map[d]);
};

// رنگ ثابت و قابل پیش‌بینی برای هر نام، برای تنوع بصری آواتار مهمانان
const nameToAvatarGradient = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `linear-gradient(135deg, hsl(${hue}, 32%, 52%), hsl(${(hue + 35) % 360}, 28%, 38%))`;
};

function useCountdown(targetISO) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(target - now, 0);
  return useMemo(() => ({
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isOver: target - now <= 0,
  }), [diff, target, now]);
}

/* ---------------- audio ---------------- */
function useRomanticMusic() {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (typeof window === 'undefined') return;

    const audio = new Audio();
    audio.src = weddingInfo.musicFile;
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = 'metadata';

    const handleCanPlay = () => {
      if (mounted.current) setIsReady(true);
    };
    const handleError = (e) => console.error('Audio error:', e);

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);
    audioRef.current = audio;

    return () => {
      mounted.current = false;
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const start = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.warn('Play blocked:', err));
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }, []);

  return { start, pause, muted, toggleMute, isReady };
}

/* ---------------- صدای باز شدن نامه ---------------- */
function usePaperSound() {
  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const audio = new Audio(weddingInfo.paperSoundFile);
    audio.volume = 0.55;
    audio.preload = 'auto';
    audioRef.current = audio;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    try {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    } catch (e) {
      // فایل صدا هنوز اضافه نشده - بی‌خطر رد می‌شویم
    }
  }, []);

  return play;
}

/* ---------------- لرزش هنگام باز شدن (موبایل) ---------------- */
function triggerOpenHaptics() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate([25, 15, 35]);
  }
}

/* ---------------- شخصی‌سازی با نام مهمان (?name=) ---------------- */
function useGuestName() {
  const [guestName, setGuestName] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name') || params.get('guest');
    if (name) setGuestName(decodeURIComponent(name).slice(0, 40));
  }, []);

  return guestName;
}

/* ---------------- دریافت پیام‌های مهمانان از JSON ---------------- */
function useGuestMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch(weddingInfo.messagesFile)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled && data?.messages) {
          setMessages(data.messages);
          if (data.lastUpdated) setLastUpdated(data.lastUpdated);
        }
      })
      .catch(() => {
        // در صورت خطا، از داده‌های نمونه استفاده کن
        setMessages([
          { id: 1, from: 'عارفه', text: 'آمادهام مجلس رو بفرستم هوا! 💃🕺', date: '۱۴۰۳/۰۵/۱۷ - ۱۷:۲۹' },
          { id: 2, from: 'محمد', text: 'حتماً میام با هدیه و رقص 🕺🎁', date: '۱۴۰۳/۰۵/۱۷ - ۱۱:۲۳' },
          { id: 3, from: 'سارا', text: 'تبریک به شما عزیزان! بهترین آرزوها رو براتون دارم 💝', date: '۱۴۰۳/۰۵/۱۶ - ۲۰:۱۵' },
        ]);
        setLastUpdated('۱۴۰۳/۰۵/۱۷');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { messages, loading, lastUpdated };
}

/* ============================================================
   کامپوننت‌ها
   ============================================================ */

// 1. افکت جرقه‌های طلایی
const SparkleBurst = React.memo(({ trigger }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 20 }, () => ({
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 3 + Math.random() * 6,
        angle: Math.random() * 360,
        distance: 50 + Math.random() * 150,
        duration: 0.8 + Math.random() * 0.6,
        delay: Math.random() * 0.2,
      }));
      setParticles(newParticles);
      const timer = setTimeout(() => setParticles([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${COLORS.goldLight}, ${COLORS.gold})`,
            borderRadius: '50%',
            boxShadow: `0 0 ${p.size * 2}px ${COLORS.gold}`,
            animation: `sparkleBurst ${p.duration}s ease-out ${p.delay}s forwards`,
            transform: `rotate(${p.angle}deg)`,
            '--distance': `${p.distance}px`,
          }}
        />
      ))}
    </>
  );
});
SparkleBurst.displayName = 'SparkleBurst';

// 2. افکت کانفتی
const ConfettiEffect = React.memo(({ active }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (active) {
      const colors = ['#c9a24b', '#f3e0b0', '#839678', '#e8e2d5', '#ff6b6b'];
      const pieces = Array.from({ length: 30 }, () => ({
        id: Math.random(),
        x: Math.random() * 100,
        y: -10 - Math.random() * 30,
        size: 4 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 1.5,
        xDrift: (Math.random() - 0.5) * 100,
      }));
      setConfetti(pieces);
      const timer = setTimeout(() => setConfetti([]), 6000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (confetti.length === 0) return null;

  return (
    <>
      {confetti.map(c => (
        <div
          key={c.id}
          className="absolute pointer-events-none"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: c.size,
            height: c.size * 0.6,
            background: c.color,
            transform: `rotate(${c.rotation}deg)`,
            animation: `confettiFall ${c.duration}s ease-in ${c.delay}s forwards`,
            '--drift': `${c.xDrift}px`,
          }}
        />
      ))}
    </>
  );
});
ConfettiEffect.displayName = 'ConfettiEffect';

// 3. حباب‌های قلبی
const HeartBubbles = React.memo(() => {
  const bubbles = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    size: 12 + Math.random() * 25,
    left: 2 + Math.random() * 90,
    delay: Math.random() * 14,
    duration: 20 + Math.random() * 15,
    opacity: 0.04 + Math.random() * 0.08,
    emoji: ['❤️', '💕', '💖', '✨', '🌸'][Math.floor(Math.random() * 5)],
  })), []);

  return (
    <>
      {bubbles.map(b => (
        <div
          key={b.id}
          className="absolute pointer-events-none flex items-center justify-center"
          style={{
            left: `${b.left}%`,
            bottom: '-10%',
            fontSize: b.size,
            opacity: b.opacity,
            animation: `heartBubbleRise ${b.duration}s ease-in ${b.delay}s infinite`,
            transform: 'translateX(-50%)',
          }}
        >
          {b.emoji}
        </div>
      ))}
    </>
  );
});
HeartBubbles.displayName = 'HeartBubbles';

// 4. کرونومتر
const GlowingCountdown = React.memo(() => {
  const { days, hours, minutes, seconds, isOver } = useCountdown(weddingInfo.weddingDateTime);

  const items = useMemo(() => [
    { value: days, label: 'روز' },
    { value: hours, label: 'ساعت' },
    { value: minutes, label: 'دقیقه' },
    { value: seconds, label: 'ثانیه' },
  ], [days, hours, minutes, seconds]);

  if (isOver) {
    return (
      <div className="flex flex-col items-center gap-1 mt-2">
        <span className="text-lg font-bold" style={{ color: COLORS.gold }}>
          🎉 مراسم آغاز شد!
        </span>
        <span className="text-xs" style={{ color: COLORS.sage }}>
          لحظات خوشی رو براتون آرزومندیم ❤️
        </span>
      </div>
    );
  }

  const isUrgent = days < 1;

  return (
    <div
      className="flex gap-1.5 sm:gap-2 justify-center flex-row-reverse mt-1.5"
      role="timer"
      aria-live="polite"
      aria-label={`${toFa(days)} روز و ${toFa(hours)} ساعت و ${toFa(minutes)} دقیقه تا شروع مراسم`}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="relative flex flex-col items-center px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl min-w-[42px] sm:min-w-[52px]"
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.35), rgba(255,255,255,0.05))',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isUrgent ? 'rgba(201,162,75,0.35)' : 'rgba(201,162,75,0.12)'}`,
            boxShadow: '0 2px 8px rgba(201,162,75,0.03), inset 0 1px 0 rgba(255,255,255,0.35)',
            animation: isUrgent ? 'urgentPulse 1.8s ease-in-out infinite' : 'none',
          }}
        >
          {/* عدد با رنگ طلایی و سایز کوچک */}
          <span
            className="text-lg sm:text-xl font-bold tracking-wide tabular-nums"
            style={{
              color: COLORS.goldMatte,
              textShadow: '0 1px 6px rgba(201,162,75,0.15)',
              lineHeight: 1.2,
            }}
          >
            {toFa(item.value)}
          </span>

          {/* برچسب با فونت کوچک‌تر */}
          <span
            className="text-[8px] sm:text-[9px] mt-0.5 font-light tracking-widest"
            style={{
              color: '#56664d',
              opacity: 0.5,
              letterSpacing: '0.5px',
            }}
          >
            {item.label}
          </span>

          {/* نقطه تزیینی کوچک */}
          <div
            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
            style={{
              background: COLORS.gold,
              opacity: 0.2,
            }}
          />
        </div>
      ))}
    </div>
  );
});
GlowingCountdown.displayName = 'GlowingCountdown';
const CORNER_ROTATION = { tl: 0, tr: 90, br: 180, bl: 270 };
const CORNER_POSITION = {
  tl: { top: -9, left: -9 },
  tr: { top: -9, right: -9 },
  br: { bottom: -9, right: -9 },
  bl: { bottom: -9, left: -9 },
};

const CornerBracket = React.memo(({ position }) => {
  const size = 22;
  return (
    <span
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        ...CORNER_POSITION[position],
        transform: `rotate(${CORNER_ROTATION[position]}deg)`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
        <path d="M2 20 C2 9 9 2 20 2" stroke={COLORS.gold} strokeWidth="1.1" strokeLinecap="round" opacity="0.75" />
        <path d="M2 20 C2 13 5 9 11 8" stroke={COLORS.goldMatte} strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
        <circle cx="20" cy="2" r="1.6" fill={COLORS.gold} opacity="0.85" />
      </svg>
    </span>
  );
});
CornerBracket.displayName = 'CornerBracket';

const Divider = React.memo(() => (
  <div className="flex items-center justify-center gap-2.5 my-5 select-none" aria-hidden="true">
    <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.moss})` }} />
    <span style={{ display: 'inline-flex', animation: 'twinkle 3.5s ease-in-out infinite' }}>
      <SparklesIcon size={13} style={{ color: COLORS.gold, opacity: 0.9 }} />
    </span>
    <span style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${COLORS.moss}, transparent)` }} />
  </div>
));
Divider.displayName = 'Divider';

const BotanicalPatternSVG = React.memo(() => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-80">
    <defs>
      <pattern id="botanical" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        <path d="M20,40 Q35,20 50,40 T80,40" fill="none" stroke="#586b51" strokeWidth="1.2" />
        <path d="M30,30 C20,15 40,10 35,25 C45,15 50,30 35,32" fill="#72856a" opacity="0.6" />
        <path d="M70,80 Q85,60 100,80 T120,80" fill="none" stroke="#485842" strokeWidth="1.2" />
        <path d="M80,70 C70,55 90,50 85,65 C95,55 100,70 85,72" fill="#5c6f55" opacity="0.6" />
        <circle cx="25" cy="85" r="3" fill="#889c80" />
        <circle cx="35" cy="95" r="2" fill="#889c80" />
        <circle cx="95" cy="25" r="3" fill="#889c80" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#botanical)" />
  </svg>
));
BotanicalPatternSVG.displayName = 'BotanicalPatternSVG';

/* ============================================================
   طرح‌های دانتل (Lace)
   ============================================================ */

// بافت توری/دانتل - برای رویه پاکت
const LaceNetPattern = React.memo(({ id, opacity = 0.4, color = '#fffdf6' }) => (
  <svg
    width="100%"
    height="100%"
    className="absolute inset-0"
    style={{ mixBlendMode: 'soft-light', opacity }}
    aria-hidden="true"
  >
    <defs>
      <pattern id={id} x="0" y="0" width="46" height="46" patternUnits="userSpaceOnUse">
        <g stroke={color} strokeWidth="0.6" fill="none" opacity="0.85">
          <path d="M0,0 L23,23 L46,0" />
          <path d="M0,46 L23,23 L46,46" />
          <path d="M0,0 Q13,23 0,46" />
          <path d="M46,0 Q33,23 46,46" />
        </g>
        <g fill={color} opacity="0.75">
          <circle cx="23" cy="15.5" r="2.3" />
          <circle cx="15.5" cy="23" r="2.3" />
          <circle cx="30.5" cy="23" r="2.3" />
          <circle cx="23" cy="30.5" r="2.3" />
        </g>
        <circle cx="23" cy="23" r="1.6" fill={COLORS.goldLight} opacity="0.85" />
        <g fill={color} opacity="0.55">
          <circle cx="0" cy="0" r="1.1" />
          <circle cx="46" cy="0" r="1.1" />
          <circle cx="0" cy="46" r="1.1" />
          <circle cx="46" cy="46" r="1.1" />
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
));
LaceNetPattern.displayName = 'LaceNetPattern';

// نوار حاشیه دانتل (طرح هلالی گیپور) - برای لبه‌های پاکت و روبان
const LaceScallopBorder = React.memo(({ count = 16, flip = false, color = '#fffdf6', opacity = 0.95, tone }) => {
  const width = 400;
  const sw = width / count;
  const r = sw / 2;
  const pad = 5;
  const baseY = flip ? pad : r + pad;
  const sweep = flip ? 1 : 0;

  let d = `M0,${baseY} `;
  for (let i = 0; i < count; i++) {
    d += `a${r},${r} 0 0,${sweep} ${sw},0 `;
  }

  const dots = Array.from({ length: count }).map((_, i) => ({
    x: i * sw + r,
    y: flip ? baseY + r * 0.62 : baseY - r * 0.62,
  }));

  return (
    <svg
      width="100%"
      height={r + pad * 2}
      viewBox={`0 0 ${width} ${r + pad * 2}`}
      preserveAspectRatio="none"
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden="true"
    >
      <path d={d} fill="none" stroke={color} strokeWidth="1.1" opacity={opacity} />
      <line
        x1="0" y1={flip ? r + pad * 2 - 1 : 1}
        x2={width} y2={flip ? r + pad * 2 - 1 : 1}
        stroke={color} strokeWidth="0.9" opacity={opacity * 0.65}
      />
      {dots.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.3" fill={tone || COLORS.gold} opacity={opacity * 0.8} />
      ))}
    </svg>
  );
});
LaceScallopBorder.displayName = 'LaceScallopBorder';

// مدال دانتل گرد - جایگزین انگ کاغذی روی روبان
const LaceMedallionTag = React.memo(() => {
  const size = 108;
  const c = size / 2;
  const rOuter = c - 6;
  const scallops = 14;
  const pts = Array.from({ length: scallops }).map((_, i) => {
    const a = (i / scallops) * Math.PI * 2 - Math.PI / 2;
    return [c + rOuter * Math.cos(a), c + rOuter * Math.sin(a)];
  });
  const armR = (Math.PI * rOuter * 2) / scallops / 2 + 0.5;
  let d = `M ${pts[0][0]},${pts[0][1]} `;
  for (let i = 1; i <= scallops; i++) {
    const p = pts[i % scallops];
    d += `A ${armR},${armR} 0 0,1 ${p[0]},${p[1]} `;
  }
  d += 'Z';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          width: size + 22,
          height: size + 22,
          background: `radial-gradient(circle, ${COLORS.goldLight}66, transparent 70%)`,
          filter: 'blur(7px)',
        }}
      />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 drop-shadow-md">
        <defs>
          <linearGradient id="medallionRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={COLORS.goldLight} />
            <stop offset="50%" stopColor={COLORS.gold} />
            <stop offset="100%" stopColor={COLORS.goldMatte} />
          </linearGradient>
        </defs>
        <circle cx={c} cy={c} r={rOuter - 5} fill={COLORS.paper} stroke="url(#medallionRing)" strokeWidth="1.1" />
        <path d={d} fill="none" stroke="url(#medallionRing)" strokeWidth="1" opacity="0.9" />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="1.5" fill={COLORS.gold} opacity="0.8" />
        ))}
        <circle cx={c} cy={c} r={rOuter - 12} fill="none" stroke={COLORS.sage} strokeWidth="0.6" strokeDasharray="1.5 2.5" opacity="0.55" />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-3">
        <Heart size={11} style={{ color: COLORS.gold }} className="mb-1" />
        <span className="text-[10px] leading-tight font-serif font-bold tracking-wide text-gray-700">
          Arefeh
        </span>
        <span className="text-[7px] leading-tight text-gray-400 tracking-widest -my-0.5">&</span>
        <span className="text-[10px] leading-tight font-serif font-bold tracking-wide text-gray-700">
          Mohammad Javad
        </span>
      </div>
    </div>
  );
});
LaceMedallionTag.displayName = 'LaceMedallionTag';

/* ---------------- Envelope ---------------- */
const Envelope = React.memo(({ phase, onOpen, guestName }) => {
  const isOpening = phase === 'opening' || phase === 'open';
  const isOpen = phase === 'open';

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center select-none"
      style={{
        perspective: 1200,
        opacity: isOpen ? 0 : 1,
        pointerEvents: isOpen ? 'none' : 'auto',
        transition: 'opacity 0.8s ease 0.4s',
      }}
    >
      <button
        onClick={onOpen}
        disabled={phase !== 'closed'}
        className="relative outline-none group cursor-pointer transition-transform duration-500 hover:scale-[1.015] focus-visible:scale-[1.015] focus-visible:ring-2 focus-visible:ring-offset-4 rounded-lg"
        style={{
          width: 360,
          height: 500,
          maxWidth: '90vw',
          maxHeight: '80vh',
          animation: phase === 'closed' ? 'floatY 6s ease-in-out infinite' : 'none',
          '--tw-ring-color': COLORS.goldMatte,
        }}
      >
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'rgba(30, 40, 25, 0.12)',
            filter: 'blur(28px)',
            transform: 'translateY(22px) scale(0.90)',
            transition: 'all 1s ease',
          }}
        />
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'rgba(20, 30, 15, 0.08)',
            filter: 'blur(15px)',
            transform: 'translateY(8px) scale(0.97)',
            transition: 'all 1s ease',
          }}
        />

        <div
          className="relative w-full h-full rounded-lg"
          style={{
            background: `linear-gradient(170deg, ${COLORS.linen} 0%, #f0ebe0 50%, ${COLORS.linen} 100%)`,
            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.05)',
            border: `1px solid ${COLORS.sageLight}`,
            overflow: phase === 'closed' ? 'hidden' : 'visible',
          }}
        >
          <div className="absolute inset-0 z-0 rounded-lg overflow-hidden bg-[#e3e8e0]">
            <BotanicalPatternSVG />
          </div>

          <div
            className="absolute left-0 right-0 mx-auto w-[92%] bg-white rounded-t-xl overflow-hidden z-10 shadow-md"
            style={{
              bottom: isOpening ? '44%' : '12%',
              transform: isOpening ? 'translateY(-6px) rotate(-1deg) scale(1.03)' : 'translateY(0) rotate(0deg) scale(1)',
              transition: 'bottom 1.2s cubic-bezier(0.22,1,0.36,1), transform 1.2s cubic-bezier(0.22,1,0.36,1)',
              border: '1px solid #e0d8c8',
              maxHeight: '82%',
              boxShadow: '0 14px 34px rgba(0,0,0,0.18)',
            }}
          >
            <img
              src={INVITE_IMAGE_URL}
              alt="دعوت‌نامه"
              draggable="false"
              loading="lazy"
              className="w-full h-auto object-cover object-top select-none block"
            />
          </div>

          <div
            className="absolute inset-0 z-20 transition-transform duration-700 ease-in-out origin-left pointer-events-none"
            style={{
              transform: isOpening ? 'rotateY(-110deg)' : 'rotateY(0deg)',
              clipPath: 'polygon(0 0, 68% 48%, 0 100%)',
              background: COLORS.envelopeGreen,
              boxShadow: '3px 0 15px rgba(0,0,0,0.12)',
            }}
          >
            <div className="w-full h-full relative" style={{ background: `linear-gradient(145deg, ${COLORS.envelopeGreenLight}, ${COLORS.envelopeGreen})` }}>
              <LaceNetPattern id="laceLeftFlap" opacity={0.4} />
            </div>
          </div>

          <div
            className="absolute inset-0 z-20 transition-transform duration-700 ease-in-out origin-right pointer-events-none"
            style={{
              transform: isOpening ? 'rotateY(110deg)' : 'rotateY(0deg)',
              clipPath: 'polygon(100% 0, 32% 52%, 100% 100%)',
              background: COLORS.envelopeGreenDark,
              boxShadow: '-3px 0 15px rgba(0,0,0,0.12)',
            }}
          >
            <div className="w-full h-full relative" style={{ background: `linear-gradient(-145deg, ${COLORS.envelopeGreenLight}, ${COLORS.envelopeGreenDark})` }}>
              <LaceNetPattern id="laceRightFlap" opacity={0.4} />
            </div>
          </div>

          <div
            className="absolute inset-0 z-20 transition-transform duration-700 ease-in-out origin-bottom pointer-events-none"
            style={{
              transform: isOpening ? 'translateY(100%)' : 'translateY(0)',
              clipPath: 'polygon(0 100%, 100% 100%, 50% 58%)',
              background: COLORS.envelopeGreen,
              boxShadow: '0 -5px 20px rgba(0,0,0,0.08)',
            }}
          >
            <LaceNetPattern id="laceBottomFlap" opacity={0.4} />
          </div>

          <div
            className="absolute inset-0 z-30 pointer-events-none transition-all duration-500 ease-out"
            style={{
              opacity: isOpening ? 0 : 1,
              transform: isOpening ? 'scale(1.2) rotate(10deg)' : 'scale(1) rotate(0deg)',
            }}
          >
            <div
              className="absolute w-full"
              style={{ top: '46%', height: '10%' }}
            >
              <div className="absolute inset-x-0 top-0">
                <LaceScallopBorder count={26} flip={false} color="#fffdf6" opacity={0.85} tone={COLORS.goldLight} />
              </div>
              <div
                className="absolute inset-x-0"
                style={{
                  top: '38%',
                  height: '24%',
                  background: 'linear-gradient(90deg, #bfa054, #f5e4a6, #bfa054)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}
              />
            </div>

            <div
              className="absolute left-1/2 top-[52%]"
              style={{
                filter: 'drop-shadow(3px 8px 14px rgba(0,0,0,0.22))',
                transform: isOpening
                  ? 'translate(-50%, -50%) rotate(420deg) scale(0.75)'
                  : 'translate(-50%, -50%) rotate(0deg) scale(1)',
                transition: 'transform 0.6s cubic-bezier(0.45, 0, 0.2, 1)',
              }}
            >
              <LaceMedallionTag />
            </div>
          </div>

          <div
            className="absolute bottom-4 left-0 right-0 text-center z-30 pointer-events-none"
            style={{
              opacity: isOpening ? 0 : 0.9,
              transition: 'opacity 0.5s ease 0.2s',
            }}
          >
            <span
              className="text-[10px] tracking-[0.15em] font-light"
              style={{
                color: COLORS.ink,
                opacity: 0.5,
                letterSpacing: '1px',
                fontFamily: "'Georgia', serif",
              }}
            >
              28August 2026
            </span>
          </div>
        </div>
      </button>

      <div
        className="mt-6 text-center pointer-events-none transition-opacity duration-500 z-40"
        style={{
          opacity: phase === 'closed' ? 0.6 : 0,
        }}
      >
        {guestName && (
          <p className="text-sm font-medium mb-1.5" style={{ color: COLORS.sageDark }}>
            {guestName} عزیز 🌿
          </p>
        )}
        <p className="text-xs font-light text-gray-600 tracking-wide flex items-center justify-center gap-1.5 opacity-80">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: COLORS.goldMatte }}
          />
          جهت بازکردن پاکت کلیک یا لمس کنید
        </p>
      </div>
    </div>
  );
});
Envelope.displayName = 'Envelope';

/* ============================================================
   INVITATION CARD - اضافه شده
   ============================================================ */

const MAP_LOCATION = {
  lat: 31.8258,
  lng: 54.3736,
  name: weddingInfo.ceremonyLocationName,
};

const MAP_PROVIDERS = {
  google: {
    name: 'گوگل مپ',
    icon: <MapPin size={14} />,
    link: weddingInfo.mapLink,
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4056.4867639029408!2d54.37363117613587!3d31.82582763198631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fa61ec2f947a14f%3A0x8549431694bc2ce0!2sRah%20O%20Ma%20Hotel%20%26%20Restaurant!5e1!3m2!1sen!2s!4v1786420538726!5m2!1sen!2s',
    color: `linear-gradient(135deg, ${COLORS.sage}, ${COLORS.sageDark})`,
    textColor: '#fffdf6',
  },
  neshan: {
    name: 'نشان',
    icon: <Navigation size={14} />,
    link: 'https://neshan.org/maps/iframe/places/9c17738db9e2cf3f9bda990b3bb4bafa#c31.826-54.378-17z-0p/31.82598739999998/54.376135700000006',
    embed: 'https://neshan.org/maps/iframe/places/9c17738db9e2cf3f9bda990b3bb4bafa#c31.826-54.378-17z-0p/31.82598739999998/54.376135700000006',
    color: 'rgba(201,162,75,0.08)',
    textColor: COLORS.ink,
    border: true,
  },
  balad: {
    name: 'بلد',
    icon: <Navigation size={14} />,
    link: weddingInfo.baladLink,
    embed: 'https://balad.ir/embed?p=5sJhngNV76jR2a&zoom=18.5&marker=1&type=standard',
    color: 'rgba(255,255,255,0.7)',
    textColor: COLORS.sageDark,
    border: true,
  },
};

const RealMapPreview = React.memo(() => {
  const [showMap, setShowMap] = useState('neshan');

  const location = {
    lat: 31.8258,
    lng: 54.3736,
    name: weddingInfo.ceremonyLocationName
  };

  const maps = {
    google: {
      name: 'گوگل مپ',
      icon: <MapPin size={14} />,
      link: weddingInfo.mapLink,
      embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4056.4867639029408!2d54.37363117613587!3d31.82582763198631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fa61ec2f947a14f%3A0x8549431694bc2ce0!2sRah%20O%20Ma%20Hotel%20%26%20Restaurant!5e1!3m2!1sen!2s!4v1786420538726!5m2!1sen!2s',
      navigateLink: `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`,
      navLabel: 'مسیریابی با گوگل مپ'
    },
    neshan: {
      name: 'نشان',
      icon: <Navigation size={14} />,
      link: 'https://neshan.org/maps/iframe/places/9c17738db9e2cf3f9bda990b3bb4bafa#c31.826-54.378-17z-0p/31.82598739999998/54.376135700000006',
      embed: 'https://neshan.org/maps/iframe/places/9c17738db9e2cf3f9bda990b3bb4bafa#c31.826-54.378-17z-0p/31.82598739999998/54.376135700000006',
      navigateLink: `https://neshan.org/maps/direction?origin=my_location&destination=${location.lat},${location.lng}`,
      navLabel: 'مسیریابی با نشان'
    },
    balad: {
      name: 'بلد',
      icon: <Navigation size={14} />,
      link: weddingInfo.baladLink,
      embed: 'https://balad.ir/embed?p=5sJhngNV76jR2a&zoom=18.5&marker=1&type=standard',
      navigateLink: `https://balad.ir/direction?destination=${location.lat},${location.lng}`,
      navLabel: 'مسیریابی با بلد'
    }
  };

  const currentMap = maps[showMap];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: 240, background: COLORS.linen }}>
      {/* دکمه‌های تغییر نقشه */}
      <div className="absolute top-2 left-2 z-10 flex gap-1.5">
        {Object.entries(maps).map(([key, map]) => (
          <button
            key={key}
            onClick={() => setShowMap(key)}
            className={`px-3 py-1.5 text-[10px] font-medium rounded-full transition-all flex items-center gap-1 ${showMap === key
              ? 'bg-white/95 shadow-lg text-gray-800'
              : 'bg-white/50 backdrop-blur-sm text-gray-500 hover:bg-white/80'
              }`}
            style={{ border: '1px solid rgba(255,255,255,0.3)' }}
          >
            {map.icon}
            {map.name}
          </button>
        ))}
      </div>

      {/* نقشه انتخابی */}
      {showMap === 'google' && (
        <iframe
          src={maps.google.embed}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="نقشه گوگل مکان مراسم"
        />
      )}

      {showMap === 'neshan' && (
        <iframe
          src={maps.neshan.embed}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="نقشه نشان مکان مراسم"
        />
      )}

      {showMap === 'balad' && (
        <iframe
          src={maps.balad.embed}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="نقشه بلد مکان مراسم"
        />
      )}

      {/* دکمه‌های پایین - به صورت یک ردیف */}
      <div className="absolute bottom-3 left-2 right-2 z-10 flex items-center justify-center gap-2 pointer-events-none">
        {/* دکمه مسیریابی */}
        <a
          href={currentMap.navigateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 max-w-[200px] text-[10px] px-3 py-2 rounded-full shadow-md pointer-events-auto transition-all flex items-center justify-center gap-1.5 bg-amber-600 text-white hover:bg-amber-700 hover:scale-105"
          style={{
            boxShadow: '0 4px 12px rgba(201,162,75,0.3)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Navigation size={13} />
          {currentMap.navLabel}
        </a>
      </div>

      {/* نام مکان */}
      <div className="absolute top-2 right-2 pointer-events-none z-10">
        <span className="text-[10px] px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/90 shadow-md">
          {location.name}
        </span>
      </div>
    </div>
  );
});
RealMapPreview.displayName = 'RealMapPreview';
// کامپوننت نمایش پیام‌های مهمانان
const GuestMessages = React.memo(() => {
  const { messages, loading, lastUpdated } = useGuestMessages();
  const [expanded, setExpanded] = useState(false);
  const displayMessages = expanded ? messages : messages.slice(0, 3);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(152,169,141,0.06)', border: `1px solid ${COLORS.sageLight}` }}>
        <div className="flex items-center gap-2">
          <Users size={16} style={{ color: COLORS.sage }} />
          <span className="text-sm font-medium" style={{ color: COLORS.sageDark }}>پیام‌های مهمانان</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-sage border-t-transparent" style={{ borderColor: `${COLORS.sage} transparent transparent transparent` }} />
          <span className="text-xs text-gray-400">در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="w-full flex flex-col items-center gap-2 p-4 rounded-xl" style={{ background: 'rgba(152,169,141,0.06)', border: `1px solid ${COLORS.sageLight}` }}>
        <Users size={20} style={{ color: COLORS.sage }} />
        <span className="text-sm text-gray-500">هنوز پیامی دریافت نشده است</span>
        <span className="text-xs text-gray-400">اولین پیام را شما ارسال کنید ✨</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 p-4 rounded-xl" style={{ background: 'rgba(152,169,141,0.06)', border: `1px solid ${COLORS.sageLight}` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={16} style={{ color: COLORS.sage }} />
          <span className="text-sm font-medium" style={{ color: COLORS.sageDark }}>پیام‌های مهمانان</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: COLORS.sageLight, color: COLORS.sageDark }}>
            {toFa(messages.length)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-[9px] text-gray-400">آخرین بروزرسانی: {lastUpdated}</span>
          )}
          {messages.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-medium transition-colors cursor-pointer hover:opacity-70"
              style={{ color: COLORS.sage }}
            >
              {expanded ? 'بستن' : `+${toFa(messages.length - 3)} پیام دیگر`}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto px-1 custom-scrollbar">
        {displayMessages.map((msg) => (
          <div
            key={msg.id}
            className="flex flex-col gap-1 p-3 rounded-xl transition-all hover:shadow-sm"
            style={{ background: 'rgba(255,255,255,0.7)', border: `1px solid ${COLORS.bone}` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: nameToAvatarGradient(msg.from) }}>
                  {msg.from.charAt(0)}
                </div>
                <span className="text-sm font-medium" style={{ color: COLORS.sageDark }}>
                  {msg.from}
                </span>
                <span>
                  <Heart size={10} style={{ color: COLORS.gold }} fill={COLORS.gold} />
                </span>
              </div>
              <span className="text-[10px] text-gray-400">{msg.date}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed pr-8" style={{ direction: 'rtl' }}>
              {msg.text}
            </p>
            <div className="flex items-center gap-1 mt-1 pr-8">
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
GuestMessages.displayName = 'GuestMessages';

function InvitationCard({ visible, onReset, guestName }) {
  const { days, hours, minutes, seconds, isOver } = useCountdown(weddingInfo.weddingDateTime);

  return (
    <div
      className="relative w-full max-w-[460px] transition-all"
      style={{
        transitionDuration: '1000ms',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: visible ? '300ms' : '0ms',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.82)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        className="relative rounded-[28px] p-[6px]"
        style={{
          border: `1.5px solid ${COLORS.goldMatte}`,
          opacity: 0.95,
          boxShadow: '0 40px 100px rgba(58,53,40,0.18)',
        }}
      >
        <CornerBracket position="tl" />
        <CornerBracket position="tr" />
        <CornerBracket position="bl" />
        <CornerBracket position="br" />

        <div className="relative rounded-2xl overflow-hidden" style={{
          boxShadow: '0 40px 80px rgba(58,53,40,0.15)'
        }}>
          <button
            onClick={onReset}
            aria-label="بازگشت به پاکت"
            className="absolute z-20 flex items-center justify-center rounded-full transition-all hover:scale-110 hover:shadow-lg"
            style={{
              top: 12,
              right: 12,
              width: 34,
              height: 34,
              background: 'rgba(253,252,245,0.95)',
              color: COLORS.sageDark,
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
              border: `1px solid ${COLORS.sageLight}`,
            }}
          >
            <ArrowLeft size={18} />
          </button>

          <img
            src={INVITE_IMAGE_URL}
            alt="دعوت‌نامه عروسی عارفه و محمدجواد"
            draggable="false"
            className="w-full block select-none"
            style={{ userSelect: 'none' }}
          />

          <div className="w-full py-6 px-6 flex flex-col items-center" style={{
            background: `linear-gradient(180deg, ${COLORS.paper}, #f4f1e6)`,
            borderTop: `1px solid ${COLORS.sageLight}`
          }}>
            {guestName && (
              <span className="text-xs font-medium mb-2 px-3 py-1 rounded-full" style={{ color: COLORS.sageDark, background: 'rgba(152,169,141,0.12)' }}>
                {guestName} عزیز، خوش آمدید 🌿
              </span>
            )}
            <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: COLORS.sageDark }}>
              {isOver ? '🎉 مراسم آغاز شد' : '⏳ زمان تا شروع مراسم'}
            </span>
            {!isOver && <GlowingCountdown />}
          </div>

          <div className="flex flex-col items-center gap-4 py-6 px-6" style={{
            background: `linear-gradient(0deg, ${COLORS.paper}, #f8f6f0)`,
            borderTop: `1px solid ${COLORS.bone}`
          }}>
            {/* نقشه واقعی گوگل */}
            <RealMapPreview />

            {/* پیام‌های مهمانان */}
            <GuestMessages />

            <MessageSender guestName={guestName} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MessageSender
   ============================================================ */
const MessageSender = React.memo(({ guestName, onSuccess }) => {
  const [userName, setUserName] = useState(guestName || '');
  const [message, setMessage] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  useEffect(() => {
    if (guestName) setUserName((prev) => prev || guestName);
  }, [guestName]);

  const funnyPresets = useMemo(() => [
    "آماده‌ام مجلس رو بفرستم هوا! 💃🕺",
    "حتماً میام! با کادو و رقص روش 🎁",
    "میام فقط یه گوشه میشینم دست میزنم! 😋",
    "پری حوصلتون ندارم آخرکار میام شام و میزنم و میرم! 😜",
  ], []);

  const handleSend = useCallback(async (method) => {
    if (!userName.trim()) {
      setSendResult({
        success: false,
        message: '❌ لطفاً نام خود را وارد کنید'
      });
      return;
    }

    const text = message.trim() || 'سلام! من حتماً تو عروسیتون شرکت می‌کنم و مجلس رو گرم می‌کنم 🎉';
    const fullMessage = `${userName.trim()} : ${text}`;
    const encoded = encodeURIComponent(fullMessage);

    if (method === 'eitaa_api') {
      if (!weddingInfo.eitaaChatId || weddingInfo.eitaaChatId === 'YOUR_CHAT_ID_HERE') {
        setSendResult({
          success: false,
          message: '❌ شناسه کانال ایتایار تنظیم نشده است.'
        });
        return;
      }

      setIsLoading(true);
      setSendResult(null);

      try {
        const response = await fetch('/api/eitaa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: weddingInfo.eitaaChatId,
            text: fullMessage,
            options: { pin: 0, title: `پیام از ${userName.trim()}` },
          }),
        });

        const result = await response.json();

        if (response.ok && result.ok) {
          setSendResult({
            success: true,
            message: `✅ ${userName.trim()} عزیز، پیام پر مهرتان دریافت شد! ممنون از حضور گرمتون ❤️`
          });
          setMessage('');
          setUserName('');
          if (typeof onSuccess === 'function') onSuccess();
        } else {
          setSendResult({
            success: false,
            message: `❌ خطا در ارسال پیام: ${result.error || 'خطای ناشناخته'}`
          });
        }
      } catch (error) {
        setSendResult({
          success: false,
          message: `❌ خطا در ارتباط با سرور: ${error.message}`
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    switch (method) {
      case 'sms':
        window.location.href = `sms:${weddingInfo.smsNumber}?body=${encoded}`;
        break;
      case 'telegram':
        window.open(`https://t.me/${weddingInfo.telegramLink.replace('https://t.me/', '')}?text=${encoded}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${weddingInfo.whatsappNumber}?text=${encoded}`, '_blank');
        break;
      case 'ita':
        window.open(`https://eitaa.com/${weddingInfo.itaUsername}?text=${encoded}`, '_blank');
        break;
      default:
        break;
    }
  }, [userName, message, onSuccess]);

  const SendButton = useCallback(({ onClick, isLoading }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition-all hover:scale-[1.03] hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
      style={{
        background: `linear-gradient(135deg, ${COLORS.sage}, ${COLORS.sageDark})`,
        color: '#fffdf6',
        boxShadow: '0 8px 20px rgba(86,102,77,0.3)'
      }}
    >
      {isLoading ? (
        <>
          <span className="animate-spin">⏳</span>
          در حال ارسال...
        </>
      ) : (
        <>
          <Send size={16} />
          ارسال پیام
        </>
      )}
    </button>
  ), []);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="relative">
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <User size={16} />
        </div>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="نام خود را وارد کنید ..."
          className="w-full rounded-xl px-10 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-amber-200"
          style={{
            background: 'rgba(253,252,245,0.95)',
            border: `1.5px solid ${COLORS.sageLight}`,
            color: COLORS.ink,
            fontFamily: "'Vazirmatn', Tahoma, sans-serif",
            direction: 'rtl',
          }}
        />
      </div>

      <div className="flex flex-wrap gap-1.5 justify-center">
        {funnyPresets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => setMessage(preset)}
            className="text-[11px] px-3 py-1.5 rounded-full border transition-all hover:bg-amber-50 hover:border-amber-300"
            style={{
              borderColor: COLORS.sage,
              color: COLORS.sageDark,
              background: 'rgba(255,255,255,0.7)',
              transition: 'all 0.2s ease',
            }}
          >
            {preset}
          </button>
        ))}
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="پیام یا تبریک خودتون رو بنویسید ..."
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none focus:ring-2 focus:ring-amber-200"
        style={{
          background: 'rgba(253,252,245,0.95)',
          border: `1.5px solid ${COLORS.sageLight}`,
          color: COLORS.ink,
          minHeight: '60px',
          fontFamily: "'Vazirmatn', Tahoma, sans-serif",
          direction: 'rtl',
        }}
        rows="2"
      />

      <div className="flex flex-wrap items-center gap-2">
        <HeartButton onClick={() => {
          setShowOptions(!showOptions);
          handleSend('eitaa_api');
        }}>
          <SendButton isLoading={isLoading} />
        </HeartButton>
      </div>

      {showOptions && (
        <div className="flex flex-wrap items-center gap-2 w-full animate-fadeIn">
          <button
            onClick={() => handleSend('sms')}
            className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all hover:scale-[1.05] hover:shadow-md"
            style={{ background: COLORS.paper, border: `1.5px solid ${COLORS.sage}`, color: COLORS.sageDark }}
          >
            <Phone size={14} /> SMS
          </button>
          <button
            onClick={() => handleSend('telegram')}
            className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all hover:scale-[1.05] hover:shadow-md"
            style={{ background: COLORS.paper, border: `1.5px solid ${COLORS.sage}`, color: COLORS.sageDark }}
          >
            <MessageCircle size={14} /> تلگرام
          </button>
          <button
            onClick={() => handleSend('whatsapp')}
            className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all hover:scale-[1.05] hover:shadow-md"
            style={{ background: COLORS.paper, border: `1.5px solid ${COLORS.sage}`, color: COLORS.sageDark }}
          >
            <Share2 size={14} /> واتساپ
          </button>
          <button
            onClick={() => handleSend('ita')}
            className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all hover:scale-[1.05] hover:shadow-md"
            style={{ background: COLORS.paper, border: `1.5px solid ${COLORS.sage}`, color: COLORS.sageDark }}
          >
            <MessageCircle size={14} /> ایتا
          </button>
        </div>
      )}

      {sendResult && (
        <div
          className={`p-3 rounded-xl text-sm flex items-start gap-2 ${sendResult.success ? 'bg-green-50' : 'bg-red-50'}`}
          style={{ border: `1px solid ${sendResult.success ? '#86efac' : '#fca5a5'}` }}
        >
          {sendResult.success ? (
            <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <span className={sendResult.success ? 'text-green-700' : 'text-red-700'}>
            {sendResult.message}
          </span>
        </div>
      )}

      <div className="mt-2 pt-3 border-t border-gray-200/50">
        <p className="text-center text-[10px] text-gray-400 mb-2">راه‌های ارتباطی با ما</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={weddingInfo.telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-emerald-700 transition-colors flex items-center gap-1"
          >
            <MessageCircle size={12} /> تلگرام
          </a>
          <a
            href={`https://eitaa.com/${weddingInfo.itaUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-emerald-700 transition-colors flex items-center gap-1"
          >
            <MessageCircle size={12} /> ایتا
          </a>
          <a
            href={`https://wa.me/${weddingInfo.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-emerald-700 transition-colors flex items-center gap-1"
          >
            <Share2 size={12} /> واتساپ
          </a>
          <a
            href={`sms:${weddingInfo.smsNumber}`}
            className="text-xs text-gray-500 hover:text-emerald-700 transition-colors flex items-center gap-1"
          >
            <Phone size={12} /> پیامک
          </a>
        </div>
      </div>
    </div>
  );
});
MessageSender.displayName = 'MessageSender';

const HeartButton = React.memo(({ children, onClick }) => {
  const [hearts, setHearts] = useState([]);

  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart = {
      id: Date.now(),
      x,
      y,
      size: 15 + Math.random() * 20,
    };
    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => setHearts(prev => prev.filter(h => h.id !== newHeart.id)), 1000);
    onClick();
  }, [onClick]);

  return (
    <button onClick={handleClick} className="relative overflow-visible w-full">
      {children}
      {hearts.map(h => (
        <div
          key={h.id}
          className="absolute pointer-events-none text-red-400"
          style={{
            left: h.x,
            top: h.y,
            fontSize: h.size,
            animation: 'heartFloat 1s ease-out forwards',
          }}
        >
          ❤️
        </div>
      ))}
    </button>
  );
});
HeartButton.displayName = 'HeartButton';

/* ---------------- PhotoGallery ---------------- */
const polaroidRotations = [-6, 4, -3, 7, -4, 3, -7, 5];

function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();

    const loadPhotos = async () => {
      const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const existingPhotos = [];
      const batchSize = 4;

      for (let i = 0; i < letters.length; i += batchSize) {
        const batch = letters.slice(i, i + batchSize);
        const promises = batch.map(async (letter) => {
          try {
            const url = `/images/${letter}.webp`;
            const response = await fetch(url, {
              method: 'HEAD',
              signal: abortControllerRef.current.signal
            });
            if (response.ok) {
              return url;
            }
          } catch (error) {
            if (error.name === 'AbortError') return null;
          }
          return null;
        });

        const results = await Promise.all(promises);
        existingPhotos.push(...results.filter(Boolean));
      }

      setPhotos(existingPhotos);
      setLoading(false);
    };

    loadPhotos();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    const preventContextMenu = (e) => {
      if (e.target.closest('.gallery-image-container') || e.target.closest('.gallery-modal')) {
        e.preventDefault();
        return false;
      }
    };

    const preventDrag = (e) => {
      if (e.target.closest('.gallery-image-container') || e.target.closest('.gallery-modal')) {
        e.preventDefault();
        return false;
      }
    };

    const preventKeySave = (e) => {
      if (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'u' || e.key === 'c')) {
        if (e.target.closest('.gallery-image-container') || e.target.closest('.gallery-modal')) {
          e.preventDefault();
          return false;
        }
      }
      if (e.key === 'Escape') {
        setActivePhotoIndex(null);
      }
    };

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('dragstart', preventDrag);
    document.addEventListener('keydown', preventKeySave);

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('dragstart', preventDrag);
      document.removeEventListener('keydown', preventKeySave);
    };
  }, []);

  const handleNext = useCallback(() => {
    if (activePhotoIndex !== null && photos.length > 0) {
      setActivePhotoIndex((prev) => (prev + 1) % photos.length);
    }
  }, [activePhotoIndex, photos.length]);

  const handlePrev = useCallback(() => {
    if (activePhotoIndex !== null && photos.length > 0) {
      setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  }, [activePhotoIndex, photos.length]);

  return (
    <div className="relative z-10 w-full flex flex-col items-center px-4 py-16 sm:py-20" style={{
      background: 'linear-gradient(180deg, transparent, rgba(152,169,141,0.08), transparent)'
    }}>
      <div className="flex items-center gap-2 mb-1">
        <SparklesIcon size={14} style={{ color: COLORS.gold }} />
        <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: COLORS.moss }}>ثبت خاطرات شیرین</span>
        <SparklesIcon size={14} style={{ color: COLORS.gold }} />
      </div>

      <h3 className="mt-1 text-2xl sm:text-3xl font-extrabold" style={GOLD_TEXT}>گالری تصاویر</h3>
      <Divider />

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 w-full max-w-[650px] px-2">
        {!loading && photos.length > 0 ? (
          photos.map((photoUrl, idx) => {
            const rotate = polaroidRotations[idx % polaroidRotations.length];
            return (
              <div
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className="gallery-image-container polaroid-card relative cursor-pointer"
                style={{
                  '--rot': `${rotate}deg`,
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}
              >
                <div
                  className="relative p-2.5 pb-6"
                  style={{
                    background: '#fffdfa',
                    boxShadow: '0 10px 26px rgba(58,53,40,0.18), 0 0 0 1px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="group relative overflow-hidden" style={{ aspectRatio: '3 / 4', background: COLORS.linen }}>
                    <img
                      src={photoUrl}
                      alt={`عکس یادگاری شماره ${toFa(idx + 1)}`}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      className="w-full h-full absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none select-none"
                    />

                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                      <span className="text-[10px] text-amber-100 font-light tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        مشاهده تصویر
                      </span>
                    </div>

                    <div className="absolute top-2 right-2 z-20 opacity-70 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/40 backdrop-blur-md rounded-full p-1.5 border border-white/20">
                        <ShieldCheck size={11} className="text-amber-200" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-center">
                    <Heart size={10} style={{ color: COLORS.gold }} fill={COLORS.gold} />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          [1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl flex flex-col items-center justify-center p-6 text-center"
              style={{
                aspectRatio: '3 / 4',
                background: `linear-gradient(135deg, ${COLORS.paper}, ${COLORS.linen})`,
                border: `1.5px dashed ${COLORS.sage}`,
              }}
            >
              <Heart size={28} style={{ color: COLORS.sage, opacity: 0.5 }} className="animate-pulse mb-2" />
              <span className="text-xs" style={{ color: COLORS.sageDark }}>
                {loading ? 'در حال بارگذاری...' : 'عکس‌های یادگاری'}
              </span>
            </div>
          ))
        )}
      </div>

      {activePhotoIndex !== null && photos[activePhotoIndex] && (
        <div
          className="gallery-modal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setActivePhotoIndex(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhotoIndex(null)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
            >
              <X size={22} />
            </button>

            <div
              className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
              style={{
                maxHeight: '80vh',
                maxWidth: '90vw',
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
            >
              <img
                src={photos[activePhotoIndex]}
                alt={`Photo ${activePhotoIndex + 1}`}
                className="max-h-[80vh] max-w-[90vw] object-contain pointer-events-none select-none block"
                draggable="false"
              />

              <div
                className="absolute inset-0 z-10"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>

            {photos.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full p-3 transition-all border border-white/10"
                  aria-label="عکس قبلی"
                >
                  <ChevronRight size={22} />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full p-3 transition-all border border-white/10"
                  aria-label="عکس بعدی"
                >
                  <ChevronLeft size={22} />
                </button>
              </>
            )}

            <div className="mt-3 text-amber-200/70 text-xs tracking-widest font-light">
              {toFa(activePhotoIndex + 1)} از {toFa(photos.length)}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 w-full max-w-[440px] text-center">
        <span className="text-[10px] tracking-[0.15em]" style={{ color: COLORS.moss, opacity: 0.6 }}>
          ✦ Developer MJ ✦
        </span>
      </div>
    </div>
  );
}

/* ---------------- Petals & Twinkles ---------------- */
const Petals = React.memo(() => {
  const petals = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 8 + Math.random() * 12,
    duration: 14 + Math.random() * 12,
    delay: Math.random() * 16,
    drift: (Math.random() - 0.5) * 100,
    gold: Math.random() > 0.6,
    rotate: Math.random() * 360,
  })), []);

  return (
    <>
      {petals.map((p) => (
        <span key={p.id} aria-hidden="true" className="absolute top-[-6%] pointer-events-none"
          style={{
            left: `${p.left}%`,
            width: p.size, height: p.size * 0.7,
            background: p.gold
              ? `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.gold})`
              : `linear-gradient(135deg, ${COLORS.sageLight}, ${COLORS.sage})`,
            borderRadius: '50% 0 50% 50%',
            opacity: 0.45,
            transform: `rotate(${p.rotate}deg)`,
            '--drift': `${p.drift}px`,
            animation: `petalFall ${p.duration}s linear ${p.delay}s infinite`,
            filter: 'blur(0.5px)'
          }} />
      ))}
    </>
  );
});
Petals.displayName = 'Petals';

const NoiseOverlay = React.memo(() => (
  <div
    aria-hidden="true"
    className="absolute inset-0 pointer-events-none mix-blend-overlay"
    style={{
      opacity: 0.035,
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
    }}
  />
));
NoiseOverlay.displayName = 'NoiseOverlay';

const Twinkles = React.memo(() => {
  const stars = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 6,
    duration: 3 + Math.random() * 4,
  })), []);

  return (
    <>
      {stars.map((s) => (
        <span key={s.id} aria-hidden="true" className="absolute rounded-full pointer-events-none"
          style={{
            top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size,
            background: COLORS.goldMatte,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            boxShadow: `0 0 ${s.size * 2}px ${COLORS.goldMatte}`,
          }} />
      ))}
    </>
  );
});
Twinkles.displayName = 'Twinkles';

/* ============================================================
   کامپوننت اصلی
   ============================================================ */
export default function WeddingInvitation() {
  const [phase, setPhase] = useState('closed');
  const [showConfetti, setShowConfetti] = useState(false);
  const timerRef = useRef(null);
  const music = useRomanticMusic();
  const playPaperSound = usePaperSound();
  const guestName = useGuestName();

  const handleOpen = useCallback(() => {
    if (phase !== 'closed') return;
    setPhase('opening');
    setShowConfetti(true);
    music.start();
    playPaperSound();
    triggerOpenHaptics();
    timerRef.current = setTimeout(() => {
      setPhase('open');
      setTimeout(() => setShowConfetti(false), 3000);
    }, 1450);
  }, [phase, music, playPaperSound]);

  const handleReset = useCallback(() => {
    clearTimeout(timerRef.current);
    music.pause();
    setPhase('closed');
  }, [music]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // مدیریت اسکرول
  useEffect(() => {
    const preventScroll = (e) => {
      if (phase !== 'open') {
        e.preventDefault();
        return false;
      }
    };

    if (phase !== 'open') {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.top = '0';
      document.body.style.left = '0';

      document.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.top = '';
      document.body.style.left = '';

      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.top = '';
      document.body.style.left = '';

      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [phase]);

  return (
    <div
      dir="rtl"
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        fontFamily: "'Vazirmatn', Tahoma, sans-serif",
        height: phase !== 'open' ? '100vh' : 'auto',
        overflow: phase !== 'open' ? 'hidden' : 'visible',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');

        @keyframes floatY {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(0.6deg); }
        }
        @keyframes urgentPulse {
          0%, 100% { box-shadow: 0 2px 14px rgba(201,162,75,0.18), inset 0 1px 0 rgba(255,255,255,0.4); }
          50% { box-shadow: 0 2px 22px rgba(201,162,75,0.38), inset 0 1px 0 rgba(255,255,255,0.5); }
        }
        @keyframes petalFall {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.3; }
          100% { transform: translateY(112vh) translateX(var(--drift)) rotate(720deg); opacity: 0; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 250% 50%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sparkleBurst {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--distance), var(--distance)) scale(0); }
        }
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg) translateX(var(--drift)); opacity: 0; }
        }
        @keyframes heartBubbleRise {
          0% { transform: translateY(0) translateX(-50%) scale(0.3); opacity: 0; }
          10% { opacity: var(--opacity); }
          90% { opacity: var(--opacity); }
          100% { transform: translateY(-120vh) translateX(-50%) scale(1.5); opacity: 0; }
        }
        @keyframes heartFloat {
          0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--x), var(--y)) scale(1) rotate(180deg); opacity: 0; }
        }
          
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .gallery-image-container, .gallery-modal {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-user-drag: none;
        }
        .polaroid-card {
          transform: rotate(var(--rot, 0deg));
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease;
          will-change: transform;
        }
        .polaroid-card:hover {
          transform: rotate(0deg) scale(1.06) translateY(-6px);
          z-index: 5;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c2cdbb;
          border-radius: 10px;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <HeartBubbles />
      <ConfettiEffect active={showConfetti} />
      <SparkleBurst trigger={phase === 'opening'} />

      <div
        className="relative w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden"
        style={{
          minHeight: '100vh',
          height: phase !== 'open' ? '100vh' : 'auto',
          background: `
            radial-gradient(ellipse at 30% 30%, #fffdf9 0%, ${COLORS.linen} 40%, ${COLORS.bone} 100%)
          `,
        }}
      >
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(circle at 50% 45%, transparent 40%, ${COLORS.sageLight} 100%)`,
          opacity: 0.15
        }} />
        <NoiseOverlay />

        <Petals />
        <Twinkles />

        {phase === 'open' && (
          <button
            onClick={music.toggleMute}
            aria-label="قطع یا وصل موسیقی"
            className="fixed z-50 flex items-center justify-center rounded-full transition-all hover:scale-110 hover:shadow-lg"
            style={{
              top: 24,
              left: 24,
              width: 46,
              height: 46,
              background: 'rgba(253,252,245,0.9)',
              border: `1.5px solid ${COLORS.goldMatte}`,
              boxShadow: '0 6px 20px rgba(58,53,40,0.15)',
              color: COLORS.moss,
            }}
          >
            {music.muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        )}

        <div className="relative z-10 w-full flex items-center justify-center" style={{ minHeight: 520 }}>
          <Envelope phase={phase} onOpen={handleOpen} guestName={guestName} />
          <InvitationCard visible={phase === 'open'} onReset={handleReset} guestName={guestName} />
        </div>
      </div>

      {phase === 'open' && <PhotoGallery />}
    </div>
  );
}