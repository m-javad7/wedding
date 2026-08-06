// pages/api/eitaa.js
export default async function handler(req, res) {
  // فقط متد POST مجاز است
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { chatId, text, options } = req.body;

  // توکن خود را از متغیر محیطی بخوانید
  const token = process.env.EITAAYAR_TOKEN;
  
  if (!token) {
    return res.status(500).json({ error: 'توکن ایتایار تنظیم نشده است' });
  }

  try {
    // ارسال درخواست به API ایتایار از سمت سرور (بدون خطای CORS)
    const response = await fetch(`https://eitaayar.ir/api/${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        ...options, // شامل pin, title و غیره
      }),
    });

    const data = await response.json();

    // ارسال پاسخ به فرانت‌اند
    res.status(200).json(data);
  } catch (error) {
    console.error('خطا در ارسال به ایتایار:', error);
    res.status(500).json({ error: error.message });
  }
}