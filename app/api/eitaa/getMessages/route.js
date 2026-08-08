// app/api/bale/getMessages/route.js
import { NextResponse } from 'next/server';

// توکن ربات بله شما
const BALE_TOKEN = '1101398776:xxNBOBYHUvmY4nj1pOB2QeLIJKEFPgdYEkU';
const CHAT_ID = '@weddingMA'; // شناسه کانال (با @ یا عددی)

export async function GET(request) {
  try {
    console.log('🔄 دریافت پیام‌ها از بله از طریق API...');

    // دریافت پیام‌ها از API بله (مشابه تلگرام)
    const response = await fetch(
      `https://tapi.bale.ai/bot1101398776:xxNBOBYHUvmY4nj1pOB2QeLIJKEFPgdYEkU/getUpdates`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offset: 0, // از اولین پیام شروع کن
          limit: 50, // تعداد پیام‌ها
          timeout: 5, // تایم‌اوت
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📨 پاسخ از بله:', JSON.stringify(data, null, 2));

    // بررسی پاسخ
    if (!data.ok) {
      return NextResponse.json({
        ok: false,
        error: data.description || 'خطا در دریافت پیام‌ها',
        result: [],
        errorCode: data.error_code,
      });
    }

    // پردازش پیام‌ها
    let messages = [];
    
    if (data.result && data.result.length > 0) {
      // فیلتر کردن پیام‌های کانال
      messages = data.result
        .filter(update => {
          // فقط پیام‌های کانال را بگیر (یا هر پیامی که در کانال ارسال شده)
          const msg = update.message || update.channel_post || update.edited_channel_post;
          return msg && msg.chat && msg.chat.type === 'channel';
        })
        .map(update => {
          // استخراج پیام از ساختار بله
          const msg = update.message || update.channel_post || update.edited_channel_post;
          return {
            id: msg.message_id || Date.now(),
            from: msg.from?.username || msg.from?.first_name || 'میهمان',
            text: msg.text || msg.caption || '',
            date: msg.date || Math.floor(Date.now() / 1000),
            chat_id: msg.chat?.id,
            // اطلاعات اضافی برای نمایش
            firstName: msg.from?.first_name || '',
            lastName: msg.from?.last_name || '',
            isChannel: msg.chat?.type === 'channel',
          };
        });
    }

    // اگر پیامی وجود نداشت، پیام‌های نمونه
    if (messages.length === 0) {
      const sampleMessages = [
        {
          id: 1,
          from: 'عارفه',
          text: 'آمادهام مجلس رو بفرستم هوا! 💃🕺',
          date: Math.floor(Date.now() / 1000) - 3600,
          firstName: 'عارفه',
          lastName: '',
          isChannel: false,
        },
        {
          id: 2,
          from: 'محمد',
          text: 'حتماً میام با هدیه و رقص 🕺🎁',
          date: Math.floor(Date.now() / 1000) - 7200,
          firstName: 'محمد',
          lastName: '',
          isChannel: false,
        },
        {
          id: 3,
          from: 'سارا',
          text: 'تبریک به شما عزیزان! بهترین آرزوها رو براتون دارم 💝',
          date: Math.floor(Date.now() / 1000) - 10800,
          firstName: 'سارا',
          lastName: '',
          isChannel: false,
        },
      ];

      return NextResponse.json({
        ok: true,
        result: sampleMessages,
        count: sampleMessages.length,
        isSample: true,
        message: 'نمایش پیام‌های نمونه (هنوز پیامی دریافت نشده)',
      });
    }

    return NextResponse.json({
      ok: true,
      result: messages,
      count: messages.length,
      totalUpdates: data.result.length,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ خطا در دریافت پیام‌ها از بله:', error);
    return NextResponse.json({
      ok: false,
      error: error.message,
      result: [],
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}

// پشتیبانی از CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}