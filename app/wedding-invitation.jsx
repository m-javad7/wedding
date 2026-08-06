"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapPin, Send, Heart, Volume2, VolumeX, ArrowLeft, Navigation, MessageCircle, Share2, Phone, Sparkles as SparklesIcon, Star, X, ChevronRight, ChevronLeft, ShieldCheck, CheckCircle, AlertCircle, User, Calendar, Clock } from 'lucide-react';

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
  galleryPhotos: [
    '/images/a.webp',
    '/images/b.webp',
    '/images/c.webp',
  ],
  musicFile: '/a.mp3',
  // اطلاعات ایتایار
  eitaaChatId: '11221180', // شناسه کانال یا گروه
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
const INVITE_IMAGE_URL = 'data:image/jpeg;base64,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
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

    const handleCanPlay = () => setIsReady(true);
    const handleError = (e) => console.error('Audio error:', e);

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
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.warn('Play blocked:', err));
    }
  }

  function pause() {
    if (audioRef.current) audioRef.current.pause();
  }

  function toggleMute() {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }

  return { start, pause, muted, toggleMute, isReady };
}

/* ---------------- artwork components ---------------- */
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
          animation: phase === 'closed' ? 'floatY 4s ease-in-out infinite' : 'none'
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(10,20,15,.28)',
            filter: 'blur(30px)',
            transform: 'translateY(30px) scale(.85)',
            borderRadius: 30,
            transition: 'all 0.5s ease'
          }}
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            borderRadius: 18,
            background: `
              linear-gradient(
                160deg,
                #4f7a5c 0%,
                #3c6248 18%,
                #2c4d38 42%,
                #1f3a29 68%,
                #142a1d 100%
              )
            `,
            boxShadow: `
              inset 0 2px 20px rgba(180,220,180,0.18),
              inset 0 -15px 30px rgba(0,0,0,.35),
              0 30px 60px rgba(10,20,15,.4),
              0 0 0 2px rgba(201,162,75,0.45),
              0 0 0 8px rgba(201,162,75,0.1)
            `,
            transform: 'translateZ(0)',
            transition: 'all 0.5s ease'
          }}
        >
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

          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0px, transparent 2px, transparent 6px),
                repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0px, transparent 3px, transparent 8px)
              `
            }}
          />

          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              height: '58%',
              clipPath: 'polygon(0 100%, 100% 100%, 100% 20%, 50% 62%, 0 20%)',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.16), rgba(0,0,0,0))',
              mixBlendMode: 'multiply',
              pointerEvents: 'none',
            }}
          />
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%" viewBox="0 0 400 280" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 56 L200 174 L400 56" fill="none" stroke="rgba(201,162,75,0.28)" strokeWidth="1" />
            <path d="M0 280 L200 174" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
            <path d="M400 280 L200 174" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
          </svg>

          <div
            className="absolute inset-3 rounded-[22px]"
            style={{
              border: '2px solid rgba(201,162,75,0.5)',
              boxShadow: 'inset 0 0 60px rgba(201,162,75,0.14), 0 0 30px rgba(201,162,75,0.06)',
            }}
          />

          <div
            className="absolute inset-6 rounded-[18px]"
            style={{ border: '1px solid rgba(201,162,75,0.22)' }}
          />

          <div
            className="absolute left-1/2"
            style={{
              bottom: 20,
              transform: 'translateX(-50%)',
              width: 85,
              height: 85,
              borderRadius: '49% 51% 53% 47% / 52% 48% 52% 48%',
              background: `
                radial-gradient(
                  circle at 35% 28%,
                  #8baa7a 0%,
                  #5b8a4a 30%,
                  #3d6b2e 55%,
                  #2a4d1e 80%,
                  #1a3313 100%
                )
              `,
              boxShadow: `
                0 12px 40px rgba(0,0,0,.4),
                inset 0 -10px 25px rgba(0,0,0,.3),
                inset 0 10px 25px rgba(200,255,180,.2),
                0 0 0 8px rgba(255,250,235,.18),
                0 0 0 16px rgba(201,162,75,.08)
              `,
              opacity: phase === 'closed' ? 1 : 0,
              scale: phase === 'closed' ? 1 : 0.1,
              transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
              zIndex: 8,
              border: '2px solid rgba(201,162,75,0.25)',
            }}
          >
            {[18, 96, 172, 250, 314].map((deg, i) => (
              <span
                key={`drip-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 7 + (i % 3) * 2,
                  height: 5 + (i % 2) * 2,
                  background: 'linear-gradient(160deg, #6a9a55, #2a4d1e)',
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${deg}deg) translateY(-44px)`,
                  boxShadow: 'inset 0 1px 2px rgba(200,255,180,.2)',
                }}
              />
            ))}

            <div className="absolute inset-0" style={{ borderRadius: 'inherit', background: 'radial-gradient(circle at 30% 25%, rgba(200,255,180,.25), transparent 60%)' }} />
            <div className="absolute inset-[6px] rounded-full" style={{ border: '1.5px solid rgba(201,162,75,0.22)' }} />
            <div className="absolute inset-[14px] rounded-full" style={{ border: '1px solid rgba(201,162,75,0.16)' }} />
            <div className="absolute inset-[22px] rounded-full" style={{ border: '0.5px solid rgba(201,162,75,0.1)' }} />

            <div
              className="w-full h-full flex items-center justify-center flex-col"
              style={{
                color: '#ffdd9a',
                textShadow: '0 2px 12px rgba(0,0,0,.5), 0 0 30px rgba(201,162,75,.1)',
                fontFamily: '"Georgia", serif',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: 2 }}>M🤍A</span>
              <span style={{ fontSize: 7, letterSpacing: 5, opacity: 0.7, marginTop: 2 }}>♥ 2026 ♥</span>
            </div>
          </div>

          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              opacity: phase === 'closed' ? 0.9 : 1,
              transition: 'opacity 0.5s ease'
            }}
          >
            <div className="flex items-center gap-1 mb-2">
              <Star size={12} style={{ color: COLORS.gold, opacity: 0.6 }} />
              <Star size={10} style={{ color: COLORS.gold, opacity: 0.4 }} />
              <Star size={12} style={{ color: COLORS.gold, opacity: 0.6 }} />
            </div>

            <span style={{ color: 'rgba(255,250,235,.92)', fontSize: 12, letterSpacing: 7, fontWeight: 300, textTransform: 'uppercase', textShadow: '0 1px 8px rgba(0,0,0,0.35)' }}>
              Wedding Invitation
            </span>

            <div style={{ marginTop: 10, width: 160, height: 1.5, background: 'linear-gradient(90deg, transparent, #d9b85e, transparent)' }} />

            <strong style={{ marginTop: 16, fontSize: 24, color: '#fffbf0', fontFamily: '"Georgia", serif', textShadow: '0 2px 16px rgba(0,0,0,.4)', letterSpacing: 8 }}>
              <span className='px-10'>عارفه&nbsp;</span>
              <span className='pl-4'>&nbsp;محمدجواد</span>
            </strong>

            <div style={{ marginTop: 8, width: 100, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,250,235,.5), transparent)' }} />

            <span style={{ marginTop: 6, color: 'rgba(255,250,235,.65)', fontSize: 10, letterSpacing: 4, fontWeight: 300 }}>
              August 28, 2026
            </span>
          </div>
        </div>

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
                165deg,
                #5c8a68 0%,
                #47714f 35%,
                #345839 68%,
                #1f3a29 100%
              )
            `,
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            boxShadow: isOpen ? 'none' : '0 20px 40px rgba(10,20,15,.3), inset 0 -14px 22px -10px rgba(0,0,0,.35)',
            zIndex: 5,
            borderRadius: '28px 28px 0 0'
          }}
        />
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

function MessageSender() {
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  const funnyPresets = [
    "آماده‌ام مجلس رو بفرستم هوا! 💃🕺",
    "حتماً میام! با کادو و رقص روش 🎁",
    "میام فقط یه گوشه میشینم دست میزنم! 😋",
    "پری حوصلتون ندارم آخرکار میام شام و میزنم و میرم! 😜",
  ];

  const handleSend = async (method) => {
    // اعتبارسنجی نام کاربر
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

    // ارسال از طریق API ایتایار (از طریق سرور)
    if (method === 'eitaa_api') {
      if (!weddingInfo.eitaaChatId || weddingInfo.eitaaChatId === 'YOUR_CHAT_ID_HERE') {
        setSendResult({ 
          success: false, 
          message: '❌ شناسه کانال ایتایار تنظیم نشده است. لطفاً chat_id را در فایل تنظیمات قرار دهید.' 
        });
        return;
      }

      setIsLoading(true);
      setSendResult(null);

      try {
        // ارسال به API سرور خودمان (نه مستقیم به ایتایار)
        const response = await fetch('/api/eitaa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: weddingInfo.eitaaChatId,
            text: fullMessage,
            options: {
              pin: 1,
              title: `پیام از ${userName.trim()}`,
            },
          }),
        });

        const result = await response.json();

        if (response.ok && result.ok) {
          setSendResult({ 
            success: true, 
            message: `✅ ${userName.trim()} عزیز، پیام شما با موفقیت به کانال ایتا ارسال شد! ممنون از حضور گرمتون ❤️` 
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

    // روش‌های قبلی (SMS، تلگرام، واتساپ، ایتا)
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
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* نام کاربر */}
      <div className="relative">
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <User size={16} />
        </div>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="نام خود را وارد کنید ..."
          className="w-full rounded-xl px-10 py-2.5 text-sm outline-none transition-all"
          style={{
            background: 'rgba(255,253,246,0.85)',
            border: `1.5px solid ${COLORS.blush}`,
            color: COLORS.ink,
            fontFamily: "'Vazirmatn', Tahoma, sans-serif",
            direction: 'rtl',
          }}
        />
      </div>

      {/* متن‌های آماده طنز */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {funnyPresets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => setMessage(preset)}
            className="text-[11px] px-2.5 py-1 rounded-full border transition-all hover:bg-amber-100"
            style={{ borderColor: COLORS.gold, color: COLORS.wineDark, background: 'rgba(255,255,255,0.6)' }}
          >
            {preset}
          </button>
        ))}
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="پیام یا تبریک خودتون رو بنویسید ..."
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
            backg    return () => {
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
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.warn('Play blocked:', err));
    }
  }

  function pause() {
    if (audioRef.current) audioRef.current.pause();
  }

  function toggleMute() {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }

  return { start, pause, muted, toggleMute, isReady };
}

/* ---------------- artwork components ---------------- */
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
          animation: phase === 'closed' ? 'floatY 4s ease-in-out infinite' : 'none'
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(10,20,15,.28)',
            filter: 'blur(30px)',
            transform: 'translateY(30px) scale(.85)',
            borderRadius: 30,
            transition: 'all 0.5s ease'
          }}
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            borderRadius: 18,
            background: `
              linear-gradient(
                160deg,
                #4f7a5c 0%,
                #3c6248 18%,
                #2c4d38 42%,
                #1f3a29 68%,
                #142a1d 100%
              )
            `,
            boxShadow: `
              inset 0 2px 20px rgba(180,220,180,0.18),
              inset 0 -15px 30px rgba(0,0,0,.35),
              0 30px 60px rgba(10,20,15,.4),
              0 0 0 2px rgba(201,162,75,0.45),
              0 0 0 8px rgba(201,162,75,0.1)
            `,
            transform: 'translateZ(0)',
            transition: 'all 0.5s ease'
          }}
        >
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

          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0px, transparent 2px, transparent 6px),
                repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0px, transparent 3px, transparent 8px)
              `
            }}
          />

          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              height: '58%',
              clipPath: 'polygon(0 100%, 100% 100%, 100% 20%, 50% 62%, 0 20%)',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.16), rgba(0,0,0,0))',
              mixBlendMode: 'multiply',
              pointerEvents: 'none',
            }}
          />
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%" viewBox="0 0 400 280" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 56 L200 174 L400 56" fill="none" stroke="rgba(201,162,75,0.28)" strokeWidth="1" />
            <path d="M0 280 L200 174" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
            <path d="M400 280 L200 174" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
          </svg>

          <div
            className="absolute inset-3 rounded-[22px]"
            style={{
              border: '2px solid rgba(201,162,75,0.5)',
              boxShadow: 'inset 0 0 60px rgba(201,162,75,0.14), 0 0 30px rgba(201,162,75,0.06)',
            }}
          />

          <div
            className="absolute inset-6 rounded-[18px]"
            style={{ border: '1px solid rgba(201,162,75,0.22)' }}
          />

          <div
            className="absolute left-1/2"
            style={{
              bottom: 20,
              transform: 'translateX(-50%)',
              width: 85,
              height: 85,
              borderRadius: '49% 51% 53% 47% / 52% 48% 52% 48%',
              background: `
                radial-gradient(
                  circle at 35% 28%,
                  #8baa7a 0%,
                  #5b8a4a 30%,
                  #3d6b2e 55%,
                  #2a4d1e 80%,
                  #1a3313 100%
                )
              `,
              boxShadow: `
                0 12px 40px rgba(0,0,0,.4),
                inset 0 -10px 25px rgba(0,0,0,.3),
                inset 0 10px 25px rgba(200,255,180,.2),
                0 0 0 8px rgba(255,250,235,.18),
                0 0 0 16px rgba(201,162,75,.08)
              `,
              opacity: phase === 'closed' ? 1 : 0,
              scale: phase === 'closed' ? 1 : 0.1,
              transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
              zIndex: 8,
              border: '2px solid rgba(201,162,75,0.25)',
            }}
          >
            {[18, 96, 172, 250, 314].map((deg, i) => (
              <span
                key={`drip-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 7 + (i % 3) * 2,
                  height: 5 + (i % 2) * 2,
                  background: 'linear-gradient(160deg, #6a9a55, #2a4d1e)',
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${deg}deg) translateY(-44px)`,
                  boxShadow: 'inset 0 1px 2px rgba(200,255,180,.2)',
                }}
              />
            ))}

            <div className="absolute inset-0" style={{ borderRadius: 'inherit', background: 'radial-gradient(circle at 30% 25%, rgba(200,255,180,.25), transparent 60%)' }} />
            <div className="absolute inset-[6px] rounded-full" style={{ border: '1.5px solid rgba(201,162,75,0.22)' }} />
            <div className="absolute inset-[14px] rounded-full" style={{ border: '1px solid rgba(201,162,75,0.16)' }} />
            <div className="absolute inset-[22px] rounded-full" style={{ border: '0.5px solid rgba(201,162,75,0.1)' }} />

            <div
              className="w-full h-full flex items-center justify-center flex-col"
              style={{
                color: '#ffdd9a',
                textShadow: '0 2px 12px rgba(0,0,0,.5), 0 0 30px rgba(201,162,75,.1)',
                fontFamily: '"Georgia", serif',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: 2 }}>M🤍A</span>
              <span style={{ fontSize: 7, letterSpacing: 5, opacity: 0.7, marginTop: 2 }}>♥ 2026 ♥</span>
            </div>
          </div>

          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              opacity: phase === 'closed' ? 0.9 : 1,
              transition: 'opacity 0.5s ease'
            }}
          >
            <div className="flex items-center gap-1 mb-2">
              <Star size={12} style={{ color: COLORS.gold, opacity: 0.6 }} />
              <Star size={10} style={{ color: COLORS.gold, opacity: 0.4 }} />
              <Star size={12} style={{ color: COLORS.gold, opacity: 0.6 }} />
            </div>

            <span style={{ color: 'rgba(255,250,235,.92)', fontSize: 12, letterSpacing: 7, fontWeight: 300, textTransform: 'uppercase', textShadow: '0 1px 8px rgba(0,0,0,0.35)' }}>
              Wedding Invitation
            </span>

            <div style={{ marginTop: 10, width: 160, height: 1.5, background: 'linear-gradient(90deg, transparent, #d9b85e, transparent)' }} />

            <strong style={{ marginTop: 16, fontSize: 24, color: '#fffbf0', fontFamily: '"Georgia", serif', textShadow: '0 2px 16px rgba(0,0,0,.4)', letterSpacing: 8 }}>
              <span className='px-10'>عارفه&nbsp;</span>
              <span className='pl-4'>&nbsp;محمدجواد</span>
            </strong>

            <div style={{ marginTop: 8, width: 100, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,250,235,.5), transparent)' }} />

            <span style={{ marginTop: 6, color: 'rgba(255,250,235,.65)', fontSize: 10, letterSpacing: 4, fontWeight: 300 }}>
              August 28, 2026
            </span>
          </div>
        </div>

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
                165deg,
                #5c8a68 0%,
                #47714f 35%,
                #345839 68%,
                #1f3a29 100%
              )
            `,
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            boxShadow: isOpen ? 'none' : '0 20px 40px rgba(10,20,15,.3), inset 0 -14px 22px -10px rgba(0,0,0,.35)',
            zIndex: 5,
            borderRadius: '28px 28px 0 0'
          }}
        />
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

function MessageSender() {
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  const funnyPresets = [
    "آماده‌ام مجلس رو بفرستم هوا! 💃🕺",
    "حتماً میام! با کادو و رقص روش 🎁",
    "میام فقط یه گوشه میشینم دست میزنم! 😋",
    "پری حوصلتون ندارم آخرکار میام شام و میزنم و میرم! 😜",
  ];

  const handleSend = async (method) => {
    // اعتبارسنجی نام کاربر
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

    // ارسال از طریق API ایتایار (از طریق سرور)
    if (method === 'eitaa_api') {
      if (!weddingInfo.eitaaChatId || weddingInfo.eitaaChatId === 'YOUR_CHAT_ID_HERE') {
        setSendResult({ 
          success: false, 
          message: '❌ شناسه کانال ایتایار تنظیم نشده است. لطفاً chat_id را در فایل تنظیمات قرار دهید.' 
        });
        return;
      }

      setIsLoading(true);
      setSendResult(null);

      try {
        // ارسال به API سرور خودمان (نه مستقیم به ایتایار)
        const response = await fetch('/api/eitaa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: weddingInfo.eitaaChatId,
            text: fullMessage,
            options: {
              pin: 1,
              title: `پیام از ${userName.trim()}`,
            },
          }),
        });

        const result = await response.json();

        if (response.ok && result.ok) {
          setSendResult({ 
            success: true, 
            message: `✅ ${userName.trim()} عزیز پیام پرمهرتون رو دریافت کردیم، ممنون از حضورتون ❤️` 
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

    // روش‌های قبلی (SMS، تلگرام، واتساپ، ایتا)
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
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* نام کاربر */}
      <div className="relative">
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <User size={16} />
        </div>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="نام خود را وارد کنید ..."
          className="w-full rounded-xl px-10 py-2.5 text-sm outline-none transition-all"
          style={{
            background: 'rgba(255,253,246,0.85)',
            border: `1.5px solid ${COLORS.blush}`,
            color: COLORS.ink,
            fontFamily: "'Vazirmatn', Tahoma, sans-serif",
            direction: 'rtl',
          }}
        />
      </div>

      {/* متن‌های آماده طنز */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {funnyPresets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => setMessage(preset)}
            className="text-[11px] px-2.5 py-1 rounded-full border transition-all hover:bg-amber-100"
            style={{ borderColor: COLORS.gold, color: COLORS.wineDark, background: 'rgba(255,255,255,0.6)' }}
          >
            {preset}
          </button>
        ))}
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="پیام یا تبریک خودتون رو بنویسید ..."
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
          اعلام حضور
        </button>

        {showOptions && (
          <div className="flex flex-wrap items-center gap-2 w-full mt-2 animate-fadeIn">
            <button
              onClick={() => handleSend('eitaa_api')}
              disabled={isLoading}
              className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all hover:scale-[1.05]"
              style={{
                background: `linear-gradient(135deg, ${COLORS.wine}, ${COLORS.wineDark})`,
                color: '#fffdf6',
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                border: `1px solid ${COLORS.wineLight}`,
              }}
            >
              {isLoading ? '⏳ در حال ارسال...' : '📤 ارسال پیام'}
            </button>
            
            <button
              onClick={() => handleSend('sms')}
              className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all hover:scale-[1.05]"
              style={{ background: COLORS.paper, border: `1.5px solid ${COLORS.gold}`, color: COLORS.wineDark }}
            >
              <Phone size={14} /> SMS
            </button>
            <button
              onClick={() => handleSend('telegram')}
              className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all hover:scale-[1.05]"
              style={{ background: COLORS.paper, border: `1.5px solid ${COLORS.gold}`, color: COLORS.wineDark }}
            >
              <MessageCircle size={14} /> تلگرام
            </button>
            <button
              onClick={() => handleSend('whatsapp')}
              className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all hover:scale-[1.05]"
              style={{ background: COLORS.paper, border: `1.5px solid ${COLORS.gold}`, color: COLORS.wineDark }}
            >
              <Share2 size={14} /> واتساپ
            </button>
            {/* <button
              onClick={() => handleSend('ita')}
              className="flex-1 min-w-[80px] inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all hover:scale-[1.05]"
              style={{ background: COLORS.paper, border: `1.5px solid ${COLORS.gold}`, color: COLORS.wineDark }}
            >
              <MessageCircle size={14} /> ایتا
            </button> */}
          </div>
        )}
      </div>

      {sendResult && (
        <div 
          className={`p-3 rounded-xl text-sm flex items-start gap-2 ${sendResult.success ? 'bg-green-50' : 'bg-red-50'}`}
          style={{
            border: `1px solid ${sendResult.success ? '#86efac' : '#fca5a5'}`,
          }}
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

      {/* راه‌های ارتباطی */}
      <div className="mt-2 pt-3 border-t border-gray-200/50">
        <p className="text-center text-[10px] text-gray-400 mb-2">راه‌های ارتباطی با ما</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={weddingInfo.telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-1"
          >
            <MessageCircle size={12} /> تلگرام
          </a>
          <a
            href={`https://eitaa.com/${weddingInfo.itaUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-1"
          >
            <MessageCircle size={12} /> ایتا
          </a>
          <a
            href={`https://wa.me/${weddingInfo.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-1"
          >
            <Share2 size={12} /> واتساپ
          </a>
          <a
            href={`sms:${weddingInfo.smsNumber}`}
            className="text-xs text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-1"
          >
            <Phone size={12} /> پیامک
          </a>
        </div>
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
            src={INVITE_IMAGE_URL}
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
              <div className="mt-2 flex items-center gap-3" dir="ltr">
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
   گالری عکس
   ============================================================ */
function PhotoGallery() {
  const hasPhotos = weddingInfo.galleryPhotos && weddingInfo.galleryPhotos.length > 0;
  const photos = hasPhotos ? weddingInfo.galleryPhotos : [];
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

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

  const handleNext = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const handlePrev = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  return (
    <div className="relative z-10 w-full flex flex-col items-center px-4 py-16 sm:py-20" style={{
      background: 'linear-gradient(180deg, transparent, rgba(201,162,75,0.08), transparent)'
    }}>
      <div className="flex items-center gap-2 mb-1">
        <SparklesIcon size={14} style={{ color: COLORS.gold }} />
        <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: COLORS.goldDark }}>ثبت خاطرات شیرین</span>
        <SparklesIcon size={14} style={{ color: COLORS.gold }} />
      </div>

      <h3 className="mt-1 text-2xl sm:text-3xl font-extrabold" style={GOLD_TEXT}>گالری تصاویر</h3>
      <Divider />

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-[650px] px-2">
        {hasPhotos ? (
          photos.map((photoUrl, idx) => (
            <div
              key={idx}
              onClick={() => setActivePhotoIndex(idx)}
              className="gallery-image-container group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
              style={{
                aspectRatio: '3 / 4',
                background: '#f4f0e6',
                boxShadow: '0 10px 30px rgba(60,60,40,0.12), 0 0 0 1px rgba(201,162,75,0.3)',
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

              <div className="absolute inset-0 rounded-2xl border-2 border-amber-500/20 group-hover:border-amber-500/60 transition-colors duration-300 pointer-events-none" />

              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                <span className="text-[11px] text-amber-100 font-light tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-amber-200/20">
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
                background: 'linear-gradient(135deg, #f7f4ed, #eae5d7)',
                border: `1.5px dashed ${COLORS.gold}`,
              }}
            >
              <Heart size={28} style={{ color: COLORS.gold, opacity: 0.5 }} className="animate-pulse mb-2" />
              <span className="text-xs" style={{ color: COLORS.wineLight }}>عکس‌های یادگاری</span>
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
              className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl"
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
        <span className="text-[10px] tracking-[0.15em]" style={{ color: COLORS.wineLight, opacity: 0.6 }}>
          ✦ تمامی حقوق برای عروس و داماد محفوظ است ✦
        </span>
      </div>
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
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

      <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden" style={{
        background: `
          radial-gradient(ellipse at 20% 20%, #fffdf9 0%, #f7f4e9 30%, #eeead9 60%, #d6dcc4 100%)
        `
      }}>
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

        <div className="relative z-10 w-full flex items-center justify-center" style={{ minHeight: 460 }}>
          <Envelope phase={phase} onOpen={handleOpen} />
          <InvitationCard visible={phase === 'open'} onReset={handleReset} />
        </div>
      </div>

      {phase === 'open' && <PhotoGallery />
      }
    </div>
  );
}
