// pages/api/eitaa.js
export default async function handler(req, res) {
  // فقط متد POST مجاز است
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { chatId, text, options } = req.body;

  
  try {
    // ارسال درخواست به API ایتایار از سمت سرور (بدون خطای CORS)
    const response = await fetch(`https://eitaayar.ir/api/bot512974:4249c370-c1b4-43cd-b8d3-dc8e4f6ca1cd/sendMessage`, {
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