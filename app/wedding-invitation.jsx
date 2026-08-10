"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { MapPin, Send, Heart, Volume2, VolumeX, ArrowLeft, Navigation, MessageCircle, Share2, Phone, Sparkles as SparklesIcon, X, ChevronRight, ChevronLeft, ShieldCheck, CheckCircle, AlertCircle, User } from 'lucide-react';

/* ============================================================
   اطلاعات مراسم
   ============================================================ */
const weddingInfo = {
  weddingDateTime: '2026-08-28T19:30:00',
  mapLink: 'https://maps.app.goo.gl/CLgomy6ba8KGDDq29',
  baladLink: 'https://balad.ir/p/5sJhngNV76jR2a',
  telegramLink: 'https://t.me/m_javad77',
  itaUsername: 'm_javad7721',
  whatsappNumber: '989162149083',
  smsNumber: '09162149083',
  galleryPhotos: ['/images/a.webp', '/images/b.webp', '/images/c.webp'],
  musicFile: '/a.mp3',
  eitaaChatId: '11221180',
  baleBotUsername: 'your_bale_bot_username',
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

const INVITE_IMAGE_URL = 'images/v.webp';

/* ============================================================
   توابع کمکی
   ============================================================ */
const toFa = (input) => {
  const map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/[0-9]/g, (d) => map[d]);
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
  const bubbles = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    size: 12 + Math.random() * 20,
    left: 5 + Math.random() * 90,
    delay: Math.random() * 15,
    duration: 20 + Math.random() * 15,
    opacity: 0.04 + Math.random() * 0.06,
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
          ❤️
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

  return (
    <div className="flex gap-3 justify-center flex-row-reverse">
      {items.map((item, i) => (
        <div
          key={i}
          className="relative flex flex-col items-center p-3 rounded-xl min-w-[70px]"
          style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(201,162,75,0.2)',
            boxShadow: '0 8px 32px rgba(201,162,75,0.1)',
          }}
        >
          <span className="text-2xl sm:text-3xl font-bold" style={GOLD_TEXT}>
            {toFa(item.value)}
          </span>
          <span className="text-[10px] mt-1 text-gray-500">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
});
GlowingCountdown.displayName = 'GlowingCountdown';

const CornerBracket = React.memo(({ position }) => {
  const size = 14;
  const base = { position: 'absolute', width: size, height: size, borderColor: COLORS.gold, opacity: 0.7 };
  const byPos = {
    tl: { top: -6, left: -6, borderTop: '1.2px solid', borderLeft: '1.2px solid' },
    tr: { top: -6, right: -6, borderTop: '1.2px solid', borderRight: '1.2px solid' },
    bl: { bottom: -6, left: -6, borderBottom: '1.2px solid', borderLeft: '1.2px solid' },
    br: { bottom: -6, right: -6, borderBottom: '1.2px solid', borderRight: '1.2px solid' },
  };
  return <span aria-hidden="true" style={{ ...base, ...byPos[position] }} />;
});
CornerBracket.displayName = 'CornerBracket';

const Divider = React.memo(() => (
  <div className="flex items-center justify-center gap-2 my-5 select-none" aria-hidden="true">
    <span style={{ width: 36, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.moss})` }} />
    <SparklesIcon size={12} style={{ color: COLORS.gold, opacity: 0.8 }} />
    <span style={{ width: 36, height: 1, background: `linear-gradient(90deg, ${COLORS.moss}, transparent)` }} />
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

/* ---------------- Envelope ---------------- */
const Envelope = React.memo(({ phase, onOpen }) => {
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
        className="relative outline-none group cursor-pointer"
        style={{
          width: 360,
          height: 500,
          maxWidth: '90vw',
          maxHeight: '80vh',
          animation: phase === 'closed' ? 'floatY 6s ease-in-out infinite' : 'none',
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
          className="relative w-full h-full rounded-lg overflow-hidden"
          style={{
            background: `linear-gradient(170deg, ${COLORS.linen} 0%, #f0ebe0 50%, ${COLORS.linen} 100%)`,
            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.05)',
            border: `1px solid ${COLORS.sageLight}`,
          }}
        >
          <div className="absolute inset-0 z-0 bg-[#e3e8e0]">
            <BotanicalPatternSVG />
          </div>

          <div
            className="absolute left-0 right-0 mx-auto w-[92%] bg-white rounded-t-xl overflow-hidden z-10 shadow-md transition-all duration-1000 ease-in-out"
            style={{
              bottom: isOpening ? '22%' : '12%',
              transform: isOpening ? 'translateY(-60px) scale(1.01)' : 'translateY(0)',
              border: '1px solid #e0d8c8',
              maxHeight: '80%',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
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
            <div className="w-full h-full" style={{ background: `linear-gradient(145deg, ${COLORS.envelopeGreenLight}, ${COLORS.envelopeGreen})` }} />
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
            <div className="w-full h-full" style={{ background: `linear-gradient(-145deg, ${COLORS.envelopeGreenLight}, ${COLORS.envelopeGreenDark})` }} />
          </div>

          <div
            className="absolute inset-0 z-20 transition-transform duration-700 ease-in-out origin-bottom pointer-events-none"
            style={{
              transform: isOpening ? 'translateY(100%)' : 'translateY(0)',
              clipPath: 'polygon(0 100%, 100% 100%, 50% 58%)',
              background: COLORS.envelopeGreen,
              boxShadow: '0 -5px 20px rgba(0,0,0,0.08)',
            }}
          />

          <div
            className="absolute inset-0 z-30 pointer-events-none transition-all duration-500 ease-out"
            style={{
              opacity: isOpening ? 0 : 1,
              transform: isOpening ? 'scale(1.2) rotate(10deg)' : 'scale(1) rotate(0deg)',
            }}
          >
            <div
              className="absolute w-full h-[3px] top-[37%]"
              style={{
                background: 'linear-gradient(90deg, #bfa054, #f5e4a6, #bfa054)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            />
            <div
              className="absolute w-full h-[3px] top-[43%]"
              style={{
                background: 'linear-gradient(90deg, #bfa054, #f5e4a6, #bfa054)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            />

            <div
              className="absolute left-[26%] top-[38%] w-[130px] h-[58px] bg-[#f7f5ee] rounded-sm p-2 shadow-xl border border-amber-200/60 transform -rotate-[22deg] flex flex-col justify-between overflow-hidden"
              style={{
                boxShadow: '3px 8px 25px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.5)',
              }}
            >
              <BotanicalPatternSVG />
              <div className="relative z-10 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-400/50 border border-gray-600/30" />
                <span className="text-[10px] font-serif font-bold text-gray-700 tracking-wider">
                  Arefeh & Mohammad
                </span>
              </div>
              <span className="relative z-10 text-[8px] text-gray-500 self-end italic">Invitation</span>
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
function InvitationCard({ visible, onReset }) {
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
            <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: COLORS.sageDark }}>
              {isOver ? '🎉 مراسم آغاز شد' : '⏳ زمان تا شروع مراسم'}
            </span>
            {!isOver && <GlowingCountdown />}
          </div>

          <div className="flex flex-col items-center gap-4 py-6 px-6" style={{
            background: `linear-gradient(0deg, ${COLORS.paper}, #f8f6f0)`,
            borderTop: `1px solid ${COLORS.bone}`
          }}>
            <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
              <a
                href={weddingInfo.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold tracking-wide transition-all hover:scale-[1.03] hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.sage}, ${COLORS.sageDark})`,
                  color: '#fffdf6',
                  boxShadow: '0 8px 20px rgba(86,102,77,0.3)'
                }}
              >
                <MapPin size={14} /> نقشه گوگل
              </a>
              <a
                href={weddingInfo.baladLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold tracking-wide border transition-all hover:scale-[1.03] hover:shadow-lg"
                style={{
                  borderColor: COLORS.goldMatte,
                  color: COLORS.ink,
                  background: 'rgba(201,162,75,0.06)',
                }}
              >
                <Navigation size={13} /> مسیریاب بلد
              </a>
            </div>

            <MessageSender />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MessageSender
   ============================================================ */
const MessageSender = React.memo(() => {
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sendResult, setSendResult] = useState(null);

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
  }, [userName, message]);

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

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-[650px] px-2">
        {!loading && photos.length > 0 ? (
          photos.map((photoUrl, idx) => (
            <div
              key={idx}
              onClick={() => setActivePhotoIndex(idx)}
              className="gallery-image-container group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
              style={{
                aspectRatio: '3 / 4',
                background: COLORS.linen,
                boxShadow: '0 10px 30px rgba(58,53,40,0.1), 0 0 0 1px rgba(152,169,141,0.3)',
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
            >
              <div
                className="w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${photoUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  pointerEvents: 'none',
                }}
              />

              <div className="absolute inset-0 rounded-2xl border-2 border-emerald-500/10 group-hover:border-emerald-500/40 transition-colors duration-300 pointer-events-none" />

              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                <span className="text-[11px] text-amber-100 font-light tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  مشاهده تصویر
                </span>
              </div>

              <div className="absolute top-2.5 right-2.5 z-20 opacity-70 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/40 backdrop-blur-md rounded-full p-1.5 border border-white/20">
                  <ShieldCheck size={12} className="text-amber-200" />
                </div>
              </div>
            </div>
          ))
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

  const handleOpen = useCallback(() => {
    if (phase !== 'closed') return;
    setPhase('opening');
    setShowConfetti(true);
    music.start();
    timerRef.current = setTimeout(() => {
      setPhase('open');
      setTimeout(() => setShowConfetti(false), 3000);
    }, 1100);
  }, [phase, music]);

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
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
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
          <Envelope phase={phase} onOpen={handleOpen} />
          <InvitationCard visible={phase === 'open'} onReset={handleReset} />
        </div>
      </div>

      {phase === 'open' && <PhotoGallery />}
    </div>
  );
}