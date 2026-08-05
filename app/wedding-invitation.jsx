"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapPin, Send, Heart, Volume2, VolumeX, ArrowLeft, Navigation, MessageCircle, Share2, Phone, Mail, Sparkles as SparklesIcon, Star, Flower } from 'lucide-react';

/* ============================================================
   اطلاعات مراسم
   ============================================================ */
const weddingInfo = {
  weddingDateTime: '2026-08-28T19:30:00',
  mapLink: 'https://maps.app.goo.gl/3GzJPzpJjGfttnK99',
  baladLink: 'https://balad.ir/p/5sJhngNV76jR2a',
  telegramLink: 'https://t.me/m_javad77',
  itaUsername: 'm_javad7721',
  whatsappNumber: '989162149083',
  smsNumber: '09162149083',
  galleryPhotos: [],
  // لینک فایل موسیقی خود را اینجا قرار دهید
  musicFile: '/a.mp3', // فایل را در پوشه public قرار دهید
};

const COLORS = {
  wine: '#5b6b4a',
  wineDark: '#3f4a34',
  wineLight: '#7c8f68',
  blush: '#eee7d6',
  gold: '#c9a24b',
  goldLight: '#f3e0b0',
  goldDark: '#a8862e',
  paper: '#fffcf6',
  ink: '#463f2e',
  envelope: '#8b7a5a',
  envelopeLight: '#c4b494',
  envelopeDark: '#6d5f43',
  cream: '#f5f0e8',
  rose: '#d4a0a0',
  roseLight: '#f0d5d5',
};

const GOLD_TEXT = {
  backgroundImage: 'linear-gradient(110deg, #9c7735 0%, #f3e0b0 22%, #c9a24b 45%, #f6e6bd 68%, #9c7735 100%)',
  backgroundSize: '250% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
  animation: 'shimmer 6s linear infinite',
};

const INVITE_IMAGE = ''

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

/* ---------------- audio ---------------- */
function useRomanticMusic() {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const audio = new Audio();
    audio.src = weddingInfo.musicFile;
    audio.loop = true;
    audio.volume = 0.6;
    audio.preload = 'auto';
    
    const handleCanPlay = () => {
      setIsReady(true);
      console.log('✅ Audio ready:', weddingInfo.musicFile);
    };
    
    const handleError = (e) => {
      console.error('❌ Audio error:', e);
      console.log('Attempted to load:', weddingInfo.musicFile);
    };
    
    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);
    
    audioRef.current = audio;
    
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);
  
  function start() {
    if (!audioRef.current) {
      console.warn('⚠️ Audio not initialized');
      return;
    }
    
    console.log('▶️ Attempting to play:', weddingInfo.musicFile);
    audioRef.current.play()
      .then(() => console.log('✅ Playing successfully'))
      .catch(err => {
        console.warn('⚠️ Play failed:', err);
        if (err.name === 'NotAllowedError') {
          console.log('🔄 Autoplay blocked, will retry on user interaction');
        }
      });
  }

  function pause() {
    if (audioRef.current) {
      audioRef.current.pause();
      console.log('⏸️ Paused');
    }
  }

  function toggleMute() {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) {
        audioRef.current.muted = next;
        console.log(`🔊 ${next ? 'Muted' : 'Unmuted'}`);
      }
      return next;
    });
  }

  return { start, pause, muted, toggleMute, isReady };
}

/* ---------------- envelope artwork ---------------- */
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
  const points = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const radius = 65;
    return { dx: Math.cos(angle) * radius, dy: Math.sin(angle) * radius, delay: i * 25 };
  });
  return (
    <>
      {points.map((p, i) => (
        <span key={i} className="absolute rounded-full"
          style={{
            left: '50%', bottom: '-28px', width: 8, height: 8, marginLeft: -4,
            background: `radial-gradient(circle, ${COLORS.goldLight}, ${COLORS.gold})`,
            boxShadow: `0 0 20px ${COLORS.gold}`,
            '--dx': `${p.dx}px`, '--dy': `${p.dy}px`,
            animation: `sparkleOut 800ms ease-out ${p.delay}ms forwards`,
          }} />
      ))}
    </>
  );
}

function Envelope({ phase, onOpen }) {
  const isOpen = phase !== 'closed';

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        perspective: 1600,
        opacity: phase === 'open' ? 0 : 1,
        pointerEvents: phase === 'open' ? 'none' : 'auto',
        transition: '1s ease'
      }}
    >
      <button
        onClick={onOpen}
        className="relative outline-none group"
        style={{
          width: 400,
          height: 280,
          maxWidth: '92vw',
          transformStyle: 'preserve-3d',
          animation: phase === 'closed'
            ? 'floatY 4s ease-in-out infinite'
            : 'none'
        }}
      >
        {/* سایه زیر پاکت */}
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(0,0,0,.2)',
            filter: 'blur(30px)',
            transform: 'translateY(30px) scale(.85)',
            borderRadius: 30,
            transition: 'all 0.5s ease'
          }}
        />

        {/* بدنه اصلی پاکت */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            borderRadius: 18,
            background: `
              linear-gradient(
                160deg,
                #e8ddc8 0%,
                #c4b59a 25%,
                #a89778 50%,
                #8d7d61 75%,
                #7a6b52 100%
              )
            `,
            boxShadow: `
              inset 0 2px 12px rgba(255,255,255,.5),
              inset 0 -12px 30px rgba(0,0,0,.2),
              0 30px 80px rgba(0,0,0,.3),
              0 0 0 2px rgba(201,162,75,0.3)
            `,
            transform: 'translateZ(0)',
            transition: 'all 0.5s ease'
          }}
        >
          {/* الگوی تزئینی پشت پاکت */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, ${COLORS.gold} 1px, transparent 1px),
                radial-gradient(circle at 80% 70%, ${COLORS.gold} 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px, 60px 60px',
            }}
          />

          {/* بافت کاغذ */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  rgba(255,255,255,.05) 0px,
                  transparent 2px,
                  transparent 6px
                ),
                repeating-linear-gradient(
                  90deg,
                  rgba(0,0,0,.03) 0px,
                  transparent 3px,
                  transparent 8px
                )
              `
            }}
          />

          {/* حاشیه طلایی برجسته */}
          <div
            className="absolute inset-3 rounded-[22px]"
            style={{
              border: '1.5px solid rgba(201,162,75,0.3)',
              boxShadow: 'inset 0 0 40px rgba(201,162,75,0.08)'
            }}
          />

          {/* نوشته روی پاکت */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <div className="flex items-center gap-1 mb-2">
              <Star size={12} style={{ color: COLORS.gold, opacity: 0.5 }} />
              <Star size={10} style={{ color: COLORS.gold, opacity: 0.3 }} />
              <Star size={12} style={{ color: COLORS.gold, opacity: 0.5 }} />
            </div>

            <span
              style={{
                color: 'rgba(255,250,235,.85)',
                fontSize: 12,
                letterSpacing: 6,
                fontWeight: 300,
                textTransform: 'uppercase',
                textShadow: '0 1px 4px rgba(0,0,0,0.2)'
              }}
            >
              Wedding Invitation
            </span>

            <div
              style={{
                marginTop: 10,
                width: 160,
                height: 1.5,
                background: 'linear-gradient(90deg, transparent, #d6b35c, transparent)'
              }}
            />

            <strong
              style={{
                marginTop: 16,
                fontSize: 22,
                color: '#fff9e8',
                fontFamily: '"Georgia", serif',
                textShadow: '0 2px 12px rgba(0,0,0,.25)',
                letterSpacing: 2
              }}
            >
              عارفه و محمدجواد
            </strong>

            <div
              style={{
                marginTop: 8,
                width: 100,
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(255,250,235,.4), transparent)'
              }}
            />

            <span
              style={{
                marginTop: 6,
                color: 'rgba(255,250,235,.5)',
                fontSize: 10,
                letterSpacing: 3,
                fontWeight: 300
              }}
            >
              August 28, 2026
            </span>
          </div>

          {/* نور روی کاغذ */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(120deg, transparent 20%, rgba(255,255,255,.15), transparent 60%)',
              animation: 'paperShine 5s infinite'
            }}
          />

          {/* خطوط تا */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: 1.5,
              background: 'linear-gradient(90deg, transparent, rgba(0,0,0,.1), transparent)'
            }}
          />
        </div>

        {/* درب پاکت */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: '62%',
            transformOrigin: 'top',
            transformStyle: 'preserve-3d',
            transform: isOpen ? 'rotateX(-170deg)' : 'rotateX(0deg)',
            transition: 'transform 1s cubic-bezier(0.2,1,0.3,1)',
            background: `
              linear-gradient(
                170deg,
                #d8ccb8 0%,
                #b8aa92 40%,
                #9f8d70 80%,
                #8b795a 100%
              )
            `,
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            boxShadow: isOpen ? 'none' : '0 20px 40px rgba(0,0,0,.2)',
            zIndex: 5,
            borderRadius: '28px 28px 0 0'
          }}
        >
          {/* تزیین درب پاکت */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 80%, rgba(201,162,75,0.08), transparent 70%)'
            }}
          />

          {/* خط وسط تا */}
          <div
            className="absolute left-1/2 top-0"
            style={{
              width: 1,
              height: '80%',
              background: 'linear-gradient(rgba(255,255,255,.3), transparent)'
            }}
          />

          {/* المان تزئینی روی درب */}
          <div
            className="absolute left-1/2 top-[40%] -translate-x-1/2"
            style={{
              width: 30,
              height: 30,
              border: '1px solid rgba(201,162,75,0.15)',
              borderRadius: '50%',
              transform: 'translateX(-50%) rotate(45deg)'
            }}
          />
        </div>

        {/* مهر موم */}
        <div
          className="absolute left-1/2"
          style={{
            bottom: -32,
            transform: 'translateX(-50%)',
            width: 76,
            height: 76,
            borderRadius: '50%',
            background: `
              radial-gradient(
                circle at 35% 30%,
                #ffdca0 0%,
                #e8b84a 30%,
                #c99632 55%,
                #a67a28 75%,
                #8b641c 100%
              )
            `,
            boxShadow: `
              0 12px 35px rgba(0,0,0,.4),
              inset 0 -10px 15px rgba(0,0,0,.25),
              inset 0 8px 15px rgba(255,255,255,.35),
              0 0 0 8px rgba(255,253,246,.15),
              0 0 0 16px rgba(201,162,75,.05)
            `,
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 0.1 : 1,
            transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: 15
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,.2), transparent 60%)'
            }}
          />
          
          <div
            className="absolute inset-[4px] rounded-full"
            style={{
              border: '1px solid rgba(201,162,75,0.2)'
            }}
          />

          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              color: '#fffdf6',
              fontWeight: 900,
              fontSize: 18,
              textShadow: '0 2px 8px rgba(0,0,0,.4)',
              letterSpacing: 3,
              fontFamily: '"Georgia", serif'
            }}
          >
           M🤍A
          </div>
          
          {/* نقاط تزیینی دور مهر */}
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                width: 3,
                height: 3,
                background: 'rgba(201,162,75,0.3)',
                left: '50%',
                top: '50%',
                transform: `rotate(${deg}deg) translateX(-50%) translateY(-${32}px)`
              }}
            />
          ))}
        </div>

        {/* جلوه hover */}
        {phase === 'closed' && (
          <div
            className="absolute inset-0 rounded-[28px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(201,162,75,0.08), transparent 70%)',
              opacity: 0,
              transition: 'opacity 0.4s ease',
              transform: 'translateZ(10px)'
            }}
          />
        )}
      </button>

      <p
        className="absolute mt-[380px] text-sm"
        style={{
          color: COLORS.wineLight,
          opacity: phase === 'closed' ? 0.7 : 0,
          transition: 'opacity 0.5s ease',
          fontFamily: "'Vazirmatn', Tahoma, sans-serif"
        }}
      >
        ✦ برای باز کردن پاکت ضربه بزنید ✦
      </p>
    </div>
  );
}

/* ---------------- کامپوننت ارسال پیام ---------------- */
function MessageSender() {
  const [message, setMessage] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  
  const handleSend = (method) => {
    const text = message.trim() || 'سلام، من در مراسم شما حضور خواهم داشت';
    const encoded = encodeURIComponent(text);
    
    switch(method) {
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
  };
  
  return (
    <div className="w-full flex flex-col gap-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="متن پیام خود را بنویسید..."
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none"
        style={{
          background: 'rgba(255,253,246,0.85)',
          border: `1.5px solid ${COLORS.blush}`,
          color: COLORS.ink,
          minHeight: '60px',
          fontFamily: "'Vazirmatn', Tahoma, sans-serif",
          direction: 'rtl',
        }}
        rows="2"
      />
      
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="flex-1 min-w-[100px] inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02]"
          style={{
            background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
            color: '#fffdf6',
            boxShadow: '0 8px 24px rgba(201,162,75,0.35)',
          }}
        >
          <Send size={16} />
          ارسال پیام
        </button>
        
        {showOptions && (
          <div className="flex flex-wrap items-center gap-2 w-full mt-2 animate-fadeIn">
            <button
              onClick={() => handleSend('sms')}
              className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all hover:scale-[1.05]"
              style={{
                background: COLORS.paper,
                border: `1.5px solid ${COLORS.gold}`,
                color: COLORS.wineDark,
              }}
            >
              <Phone size={14} />
              SMS
            </button>
            <button
              onClick={() => handleSend('telegram')}
              className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all hover:scale-[1.05]"
              style={{
                background: COLORS.paper,
                border: `1.5px solid ${COLORS.gold}`,
                color: COLORS.wineDark,
              }}
            >
              <MessageCircle size={14} />
              تلگرام
            </button>
            <button
              onClick={() => handleSend('whatsapp')}
              className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all hover:scale-[1.05]"
              style={{
                background: COLORS.paper,
                border: `1.5px solid ${COLORS.gold}`,
                color: COLORS.wineDark,
              }}
            >
              <Share2 size={14} />
              واتساپ
            </button>
            <button
              onClick={() => handleSend('ita')}
              className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all hover:scale-[1.05]"
              style={{
                background: COLORS.paper,
                border: `1.5px solid ${COLORS.gold}`,
                color: COLORS.wineDark,
              }}
            >
              <MessageCircle size={14} />
              ایتا
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- کارت دعوت ---------------- */
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
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.85)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        className="relative rounded-[28px] p-[6px]"
        style={{
          border: `2px solid ${COLORS.gold}`,
          opacity: 0.95,
          boxShadow: '0 40px 100px rgba(60,60,40,0.25)',
        }}
      >
        <CornerBracket position="tl" />
        <CornerBracket position="tr" />
        <CornerBracket position="bl" />
        <CornerBracket position="br" />
        
        <div className="relative rounded-2xl overflow-hidden" style={{
          boxShadow: '0 40px 80px rgba(60,60,40,0.25), 0 8px 24px rgba(60,60,40,0.12)'
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
              background: 'rgba(255,253,246,0.95)',
              color: COLORS.wine,
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
              border: `1px solid ${COLORS.blush}`,
            }}
          >
            <ArrowLeft size={18} />
          </button>
          
          <img
            src={INVITE_IMAGE}
            alt="دعوت‌نامه عروسی عارفه و محمدجواد"
            draggable="false"
            className="w-full block select-none"
            style={{ userSelect: 'none' }}
          />
          
          <div className="w-full py-6 px-6 flex flex-col items-center" style={{
            background: `linear-gradient(180deg, ${COLORS.paper}, #f8f4ec)`,
            borderTop: `2px solid ${COLORS.blush}`
          }}>
            <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: COLORS.wineLight }}>
              {isOver ? '🎉 مراسم آغاز شد' : '⏳ زمان تا شروع مراسم'}
            </span>
            {!isOver && (
              <div className="mt-3 flex items-center gap-4" dir="ltr">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold" style={{ color: COLORS.wine }}>{toFa(days)}</span>
                  <span className="text-[10px]" style={{ color: COLORS.wineLight }}>روز</span>
                </div>
                <span className="text-2xl font-light" style={{ color: COLORS.gold }}>:</span>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold" style={{ color: COLORS.wine }}>{toFa(pad2(hours))}</span>
                  <span className="text-[10px]" style={{ color: COLORS.wineLight }}>ساعت</span>
                </div>
                <span className="text-2xl font-light" style={{ color: COLORS.gold }}>:</span>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold" style={{ color: COLORS.wine }}>{toFa(pad2(minutes))}</span>
                  <span className="text-[10px]" style={{ color: COLORS.wineLight }}>دقیقه</span>
                </div>
                <span className="text-2xl font-light" style={{ color: COLORS.gold }}>:</span>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold" style={{ color: COLORS.wine }}>{toFa(pad2(seconds))}</span>
                  <span className="text-[10px]" style={{ color: COLORS.wineLight }}>ثانیه</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-4 py-6 px-6" style={{
            background: `linear-gradient(0deg, ${COLORS.paper}, #faf8f4)`,
            borderTop: `1px solid ${COLORS.blush}`
          }}>
            <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
              <a
                href={weddingInfo.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold tracking-wide transition-all hover:scale-[1.03] hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.wineLight}, ${COLORS.wine})`,
                  color: '#fffdf6',
                  boxShadow: '0 8px 20px rgba(91,107,74,0.3)'
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
                  borderColor: COLORS.gold,
                  color: COLORS.wineDark,
                  background: 'rgba(201,162,75,0.06)',
                }}
              >
                <Navigation size={13} /> بلد
              </a>
            </div>
            
            <MessageSender />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- گالری ---------------- */
function PhotoGallery() {
  const hasPhotos = weddingInfo.galleryPhotos.length > 0;
  const items = hasPhotos ? weddingInfo.galleryPhotos : [0, 1, 2, 3];
  
  return (
    <div className="relative z-10 w-full flex flex-col items-center px-4 py-16 sm:py-20" style={{
      background: 'linear-gradient(180deg, transparent, rgba(201,162,75,0.06))'
    }}>
      <span className="text-xs tracking-[0.3em] uppercase" style={{ color: COLORS.gold }}>لحظه‌های نامزدی</span>
      <h3 className="mt-2 text-xl sm:text-2xl font-extrabold" style={GOLD_TEXT}>گالری عکس</h3>
      <Divider />
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-5 w-full max-w-[440px]">
        {items.map((p, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden transition-transform hover:scale-[1.03] hover:shadow-xl"
            style={{
              aspectRatio: '3 / 4',
              border: `2px solid ${COLORS.gold}`,
              boxShadow: '0 12px 28px rgba(60,60,40,0.15)'
            }}
          >
            {hasPhotos ? (
              <img src={p} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{
                background: 'linear-gradient(160deg, #f6f4ec, #e9e4d3)'
              }}>
                <Heart size={24} style={{ color: COLORS.gold, opacity: 0.4 }} />
              </div>
            )}
          </div>
        ))}
      </div>
      {!hasPhotos && (
        <p className="mt-6 text-[11px] max-w-[280px] text-center" style={{ color: COLORS.wineLight, opacity: 0.8 }}>
          برای نمایش عکس‌های واقعی، آدرس آن‌ها را در آرایه‌ی galleryPhotos بالای فایل وارد کنید
        </p>
      )}
    </div>
  );
}

/* ---------------- ambient background ---------------- */
function Petals() {
  const petals = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
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
              : `linear-gradient(135deg, ${COLORS.roseLight}, ${COLORS.rose})`,
            borderRadius: '50% 0 50% 50%',
            opacity: 0.5,
            transform: `rotate(${p.rotate}deg)`,
            '--drift': `${p.drift}px`,
            animation: `petalFall ${p.duration}s linear ${p.delay}s infinite`,
            filter: 'blur(0.5px)'
          }} />
      ))}
    </>
  );
}

function Twinkles() {
  const stars = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
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
            background: COLORS.gold,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            boxShadow: `0 0 ${s.size * 2}px ${COLORS.gold}`,
          }} />
      ))}
    </>
  );
}

export default function WeddingInvitation() {
  const [phase, setPhase] = useState('closed');
  const timerRef = useRef(null);
  const music = useRomanticMusic();
  
  const handleOpen = () => {
    if (phase !== 'closed') return;
    setPhase('opening');
    music.start();
    timerRef.current = setTimeout(() => setPhase('open'), 800);
  };
  
  const handleReset = () => {
    clearTimeout(timerRef.current);
    music.pause();
    setPhase('closed');
  };
  
  useEffect(() => () => clearTimeout(timerRef.current), []);
  
  return (
    <div dir="rtl" className="relative w-full min-h-screen overflow-x-hidden" style={{ fontFamily: "'Vazirmatn', Tahoma, sans-serif" }}>
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        @keyframes sparkleOut {
          0% { transform: translate(0,0) scale(0); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(1.3); opacity: 0; }
        }
        @keyframes blobFloat1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(30px, -25px) scale(1.1); }
        }
        @keyframes blobFloat2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-25px, 30px) scale(1.08); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.25; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 0.45; transform: translate(-50%,-50%) scale(1.2); }
        }
        @keyframes petalFall {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.4; }
          100% { transform: translateY(112vh) translateX(var(--drift)) rotate(720deg); opacity: 0; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.4); }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 250% 50%; }
        }
        @keyframes paperShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
      
      <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden" style={{
        background: `
          radial-gradient(ellipse at 20% 20%, #fffdf9 0%, #f7f4e9 30%, #eeead9 60%, #d6dcc4 100%)
        `
      }}>
        {/* پس‌زمینه‌های آمبیانت */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle at 50% 45%, transparent 45%, rgba(74,84,58,0.06) 100%)'
        }} />
        
        <div aria-hidden="true" className="absolute rounded-full pointer-events-none" style={{
          width: 600, height: 600, top: '50%', left: '50%',
          background: 'radial-gradient(circle, rgba(233,201,143,0.2), transparent 70%)',
          filter: 'blur(30px)',
          animation: 'breathe 8s ease-in-out infinite',
        }} />
        
        <div aria-hidden="true" className="absolute rounded-full pointer-events-none" style={{
          width: 300, height: 300, top: '4%', left: '2%',
          background: 'radial-gradient(circle, #dfe6c9, transparent 70%)',
          opacity: 0.3,
          filter: 'blur(70px)',
          animation: 'blobFloat1 10s ease-in-out infinite'
        }} />
        
        <div aria-hidden="true" className="absolute rounded-full pointer-events-none" style={{
          width: 250, height: 250, bottom: '6%', right: '4%',
          background: 'radial-gradient(circle, #e9c98f, transparent 70%)',
          opacity: 0.2,
          filter: 'blur(80px)',
          animation: 'blobFloat2 12s ease-in-out infinite'
        }} />
        
        <Petals />
        <Twinkles />
        
        {/* دکمه قطع/وصل موسیقی */}
        {phase === 'open' && (
          <button
            onClick={music.toggleMute}
            aria-label="قطع یا وصل موسیقی"
            className="fixed z-50 flex items-center justify-center rounded-full transition-all hover:scale-110 hover:shadow-lg"
            style={{
              top: 20,
              right: 20,
              width: 44,
              height: 44,
              background: `linear-gradient(135deg, ${COLORS.paper}, #f5f0e8)`,
              border: `1.5px solid ${COLORS.gold}`,
              boxShadow: '0 4px 20px rgba(74,84,58,0.15), 0 0 0 4px rgba(201,162,75,0.08)',
              color: COLORS.wine,
            }}
          >
            {music.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        )}
        
        {/* محتوای اصلی */}
        <div className="relative z-10 w-full flex items-center justify-center" style={{ minHeight: 460 }}>
          <Envelope phase={phase} onOpen={handleOpen} />
          <InvitationCard visible={phase === 'open'} onReset={handleReset} />
        </div>
      </div>
      
      {/* گالری */}
      {phase === 'open' && <PhotoGallery />}
    </div>
  );
}